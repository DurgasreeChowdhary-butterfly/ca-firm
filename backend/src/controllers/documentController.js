const { sendWhatsApp, templates } = require('../utils/whatsapp');
const { performOCRFromBuffer } = require('../utils/ocr');
const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');
const os = require('os');

// POST /api/documents/upload
// File comes in as req.file.buffer (memory storage) → save to MongoDB as base64
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { clientName, clientEmail, clientPhone, clientWhatsapp } = req.body;
    if (!clientName || !clientEmail) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    // Encode file buffer to base64 — stored in MongoDB, survives Render redeploys
    const base64Data = req.file.buffer.toString('base64');

    // Save document immediately as "processing"
    const doc = await Document.create({
      clientName, clientEmail, clientPhone, clientWhatsapp,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fileMimeType: req.file.mimetype,
      fileData: base64Data,        // stored in MongoDB ✅
      fileUrl: null,               // no local path needed
      documentType: 'other',
      extractedData: {},
      extractionNotes: 'OCR processing...',
      status: 'processing',
    });

    // Respond immediately — OCR runs in background
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully. OCR processing in background.',
      data: { id: doc._id, status: 'processing' }
    });

    // Run OCR from the buffer (already in memory — no disk read needed)
    performOCRFromBuffer(req.file.buffer, req.file.mimetype, req.file.originalname)
      .then(async ({ extractedData, documentType, ocrText, ocrSource, confidence, processingMs }) => {
        const fieldsFound = Object.keys(extractedData).length;
        const newStatus = fieldsFound > 0 ? 'processed' : 'needs_review';

        await Document.findByIdAndUpdate(doc._id, {
          documentType,
          extractedData,
          ocrText,
          extractionNotes: `OCR via ${ocrSource}. ${fieldsFound} field(s) extracted. Confidence: ${Math.round(confidence * 100)}%. Time: ${processingMs}ms.`,
          status: newStatus,
        });

        console.log(`[Doc] ${doc._id}: ${documentType}, ${fieldsFound} fields, ${ocrSource}, ${processingMs}ms`);

        // Notify client
        const waNum = clientWhatsapp || clientPhone;
        if (waNum) {
          sendWhatsApp(waNum, templates.documentUploaded(clientName, req.file.originalname, documentType)).catch(() => {});
        }
      })
      .catch(async (err) => {
        console.error(`[Doc] OCR failed for ${doc._id}:`, err.message);
        await Document.findByIdAndUpdate(doc._id, {
          status: 'needs_review',
          extractionNotes: `OCR failed: ${err.message}. Manual review required.`,
        });
      });

  } catch (err) { next(err); }
};

// GET /api/admin/documents
const getDocuments = async (req, res, next) => {
  try {
    const { status, documentType, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (documentType) filter.documentType = documentType;
    if (search) filter.$or = [
      { clientName: { $regex: search, $options: 'i' } },
      { clientEmail: { $regex: search, $options: 'i' } },
    ];
    const total = await Document.countDocuments(filter);
    // Exclude fileData from list (huge base64 strings not needed in list view)
    const docs = await Document.find(filter)
      .select('-fileData -ocrText')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(+limit);
    res.json({ success: true, data: docs, pagination: { total, page: +page, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

// PUT /api/admin/documents/:id/review
const reviewDocument = async (req, res, next) => {
  try {
    const { extractedData, reviewNote, status, documentType } = req.body;
    const doc = await Document.findByIdAndUpdate(req.params.id, {
      extractedData, reviewNote,
      status: status || 'verified',
      documentType,
      reviewedBy: req.admin?._id,
      reviewedAt: new Date(),
    }, { new: true }).select('-fileData -ocrText');

    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    // Notify client
    const waNum = doc.clientWhatsapp || doc.clientPhone;
    if (waNum) {
      sendWhatsApp(waNum, templates.documentStatus(
        doc.clientName, doc.originalFileName, status || 'verified', reviewNote
      )).catch(() => {});
    }

    res.json({ success: true, message: 'Document reviewed', data: doc });
  } catch (err) { next(err); }
};

// GET /api/admin/documents/stats
const getDocumentStats = async (req, res, next) => {
  try {
    const [total, byStatus, byType] = await Promise.all([
      Document.countDocuments(),
      Document.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Document.aggregate([{ $group: { _id: '$documentType', count: { $sum: 1 } } }]),
    ]);
    res.json({ success: true, data: { total, byStatus, byType } });
  } catch (err) { next(err); }
};

// GET /api/admin/documents/:id/file — serve file from MongoDB base64
const serveFile = async (req, res, next) => {
  try {
    // Accept token from query param (needed for <img>/<iframe> src)
    if (req.query.token && !req.headers.authorization) {
      req.headers.authorization = `Bearer ${req.query.token}`;
    }

    // Fetch WITH fileData this time
    const doc = await Document.findById(req.params.id).select('+fileData +fileMimeType');
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    // ── Serve from MongoDB base64 (primary, always works) ──
    if (doc.fileData) {
      const buffer = Buffer.from(doc.fileData, 'base64');
      const mimeType = doc.fileMimeType || doc.mimeType || getMimeFromFilename(doc.originalFileName);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${doc.originalFileName}"`);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      return res.send(buffer);
    }

    // ── Fallback: try local disk (legacy uploads) ──
    if (doc.fileUrl) {
      const absolutePath = path.isAbsolute(doc.fileUrl)
        ? doc.fileUrl
        : path.join(__dirname, '../../uploads', path.basename(doc.fileUrl));

      if (fs.existsSync(absolutePath)) {
        const mimeType = getMimeFromFilename(doc.originalFileName);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${doc.originalFileName}"`);
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        return res.sendFile(absolutePath);
      }
    }

    return res.status(404).json({
      success: false,
      message: 'File not available. This document was uploaded before the storage upgrade. Please ask the client to re-upload.'
    });
  } catch (err) { next(err); }
};

function getMimeFromFilename(filename) {
  const ext = path.extname(filename || '').toLowerCase();
  const map = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.csv': 'text/csv',
  };
  return map[ext] || 'application/octet-stream';
}

module.exports = { uploadDocument, getDocuments, reviewDocument, getDocumentStats, serveFile };
