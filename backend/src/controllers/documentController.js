const { sendWhatsApp, templates } = require('../utils/whatsapp');
const { performOCR } = require('../utils/ocr');
const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// POST /api/documents/upload — public (client uploads)
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { clientName, clientEmail, clientPhone, clientWhatsapp } = req.body;
    if (!clientName || !clientEmail) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    // Save document record immediately as "processing"
    const doc = await Document.create({
      clientName, clientEmail, clientPhone, clientWhatsapp,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      documentType: 'other',
      extractedData: {},
      extractionNotes: 'OCR in progress...',
      status: 'processing',
      fileUrl: req.file.path || req.file.filename,
    });

    // Respond immediately — don't make client wait for OCR
    res.status(201).json({
      success: true,
      message: 'Document uploaded. OCR processing in background.',
      data: { id: doc._id, status: 'processing' }
    });

    // Run OCR in background (non-blocking)
    const filePath = path.isAbsolute(doc.fileUrl)
      ? doc.fileUrl
      : path.join(__dirname, '../../uploads', path.basename(doc.fileUrl));

    performOCR(filePath, req.file.mimetype, req.file.originalname)
      .then(async ({ extractedData, documentType, ocrText, ocrSource, confidence, processingMs }) => {
        const fieldsFound = Object.keys(extractedData).length;
        const newStatus = fieldsFound > 0 ? 'processed' : 'needs_review';

        await Document.findByIdAndUpdate(doc._id, {
          documentType,
          extractedData,
          extractionNotes: `OCR via ${ocrSource}. ${fieldsFound} field(s) extracted. Confidence: ${Math.round(confidence * 100)}%. Processed in ${processingMs}ms.`,
          status: newStatus,
          ocrText: ocrText,
        });

        console.log(`[Doc] OCR complete for ${doc._id}: ${documentType}, ${fieldsFound} fields, status=${newStatus}`);

        // Notify client via WhatsApp
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

// GET /api/admin/documents — admin list
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
    const docs = await Document.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(+limit);
    res.json({ success: true, data: docs, pagination: { total, page: +page, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

// PUT /api/admin/documents/:id/review — CA verifies extraction
const reviewDocument = async (req, res, next) => {
  try {
    const { extractedData, reviewNote, status, documentType } = req.body;
    const doc = await Document.findByIdAndUpdate(req.params.id, {
      extractedData, reviewNote,
      status: status || 'verified',
      documentType,
      reviewedBy: req.admin?._id,
      reviewedAt: new Date(),
    }, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    // Notify client about status change via WhatsApp
    const waNum = doc.clientWhatsapp || doc.clientPhone;
    if (waNum) {
      sendWhatsApp(waNum, templates.documentStatus(
        doc.clientName, doc.originalFileName, status || 'verified', reviewNote
      )).catch(() => {});
    }

    res.json({ success: true, message: 'Document reviewed and verified', data: doc });
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

// GET /api/admin/documents/:id/file — serve the actual uploaded file
const serveFile = async (req, res, next) => {
  try {
    // Allow token via query param for browser <img>/<iframe> which cannot send headers
    if (req.query.token && !req.headers.authorization) {
      req.headers.authorization = `Bearer ${req.query.token}`;
    }
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    const filePath = doc.fileUrl;
    if (!filePath) return res.status(404).json({ success: false, message: 'No file path stored' });

    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, '../../uploads', path.basename(filePath));

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server. Render free tier resets disk on redeploy — file was lost. Client needs to re-upload.'
      });
    }

    const ext = path.extname(doc.originalFileName).toLowerCase();
    const mimeMap = {
      '.pdf': 'application/pdf', '.png': 'image/png',
      '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.csv': 'text/csv',
    };
    res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${doc.originalFileName}"`);
    // Allow iframe embedding for preview
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.sendFile(absolutePath);
  } catch (err) { next(err); }
};

module.exports = { uploadDocument, getDocuments, reviewDocument, getDocumentStats, serveFile };
