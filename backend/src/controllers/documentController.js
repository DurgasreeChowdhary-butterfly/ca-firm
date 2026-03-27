const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// Simple document type classifier from filename + mimetype
function classifyDocument(filename, mimeType) {
  const f = filename.toLowerCase();
  if (f.includes('form16') || f.includes('form_16') || f.includes('form-16')) return 'form_16';
  if (f.includes('gst') && (f.includes('invoice') || f.includes('inv'))) return 'gst_invoice';
  if (f.includes('bank') || f.includes('statement') || f.includes('passbook')) return 'bank_statement';
  if (f.includes('tds') || f.includes('26as') || f.includes('certificate')) return 'tds_certificate';
  if (f.includes('itr') || f.includes('acknowledgement') || f.includes('ack')) return 'itr_acknowledgement';
  if (f.includes('balance') || f.includes('bs') || f.includes('pnl') || f.includes('profit')) return 'balance_sheet';
  if (f.includes('salary') || f.includes('payslip') || f.includes('payroll')) return 'salary_slip';
  return 'other';
}

// Extract basic data from filename patterns (real OCR needs Tesseract/OpenAI Vision)
function extractBasicData(filename, documentType) {
  const data = {};
  // Extract year patterns like "2024-25", "FY2025"
  const yearMatch = filename.match(/20\d\d[-_]?\d{2}/);
  if (yearMatch) data.assessmentYear = yearMatch[0];
  // Extract amount patterns like "Rs50000", "INR_85000"
  const amtMatch = filename.match(/(?:rs|inr|₹)[_\s]?(\d+)/i);
  if (amtMatch) data.amount = parseInt(amtMatch[1]);
  return data;
}

// POST /api/documents/upload — public (client uploads)
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { clientName, clientEmail, clientPhone } = req.body;
    if (!clientName || !clientEmail) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const documentType = classifyDocument(req.file.originalname, req.file.mimetype);
    const extractedData = extractBasicData(req.file.originalname, documentType);

    const doc = await Document.create({
      clientName, clientEmail, clientPhone,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      documentType,
      extractedData,
      extractionNotes: 'Auto-classified from filename. Manual review may be needed.',
      status: documentType !== 'other' ? 'processed' : 'needs_review',
      fileUrl: req.file.path || req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded and processed successfully',
      data: {
        id: doc._id,
        documentType,
        status: doc.status,
        extractedData: doc.extractedData,
        message: doc.status === 'processed'
          ? 'Document auto-classified. Our CA will verify the details.'
          : 'Document requires manual review by our CA team.',
      }
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
      extractedData, reviewNote, status: status || 'verified',
      documentType: documentType,
      reviewedBy: req.admin?._id,
      reviewedAt: new Date(),
    }, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
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

// GET /api/admin/documents/:id/file — serve the actual file for preview
const serveFile = async (req, res, next) => {
  try {
    // Allow token via query param for browser <img> and <iframe> src (can't set headers)
    if (req.query.token && !req.headers.authorization) {
      req.headers.authorization = `Bearer ${req.query.token}`;
    }
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
    
    const filePath = doc.fileUrl;
    if (!filePath) return res.status(404).json({ success: false, message: 'File not found on server' });
    
    // Build absolute path
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(__dirname, '../../uploads', path.basename(filePath));
    
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, message: 'File no longer exists on server' });
    }
    
    // Set proper content type
    const ext = path.extname(doc.originalFileName).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.csv': 'text/csv',
    };
    
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${doc.originalFileName}"`);
    res.sendFile(absolutePath);
  } catch (err) { next(err); }
};

module.exports = { uploadDocument, getDocuments, reviewDocument, getDocumentStats, serveFile };
