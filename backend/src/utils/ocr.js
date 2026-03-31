/**
 * Real OCR Engine
 * Uses: system tesseract binary (v5.3.4) + pdf-parse for digital PDFs
 * No external API needed — runs entirely on the server
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ── Extract text from image using system Tesseract ──────────────────────────
async function ocrImage(imagePath) {
  try {
    const result = spawnSync('tesseract', [imagePath, 'stdout', '-l', 'eng', '--psm', '6'], {
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024
    });
    if (result.status !== 0) throw new Error(result.stderr?.toString() || 'Tesseract failed');
    return result.stdout.toString().trim();
  } catch (err) {
    console.error('[OCR] Image OCR failed:', err.message);
    return '';
  }
}

// ── Extract text from PDF ────────────────────────────────────────────────────
async function extractPdfText(filePath) {
  try {
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer, { max: 0 });
    const text = data.text?.trim() || '';
    // If digital PDF has good text content, return it
    if (text.length > 50) {
      return { text, source: 'digital_pdf', pages: data.numpages };
    }
    // Otherwise it's a scanned PDF — convert to image and OCR
    return await ocrScannedPdf(filePath);
  } catch (err) {
    console.error('[OCR] PDF parse failed:', err.message);
    return { text: '', source: 'failed', pages: 0 };
  }
}

// ── OCR a scanned PDF (convert pages to images first) ───────────────────────
async function ocrScannedPdf(filePath) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ocr-'));
  try {
    // Convert PDF to PNG images using pdftoppm
    const prefix = path.join(tmpDir, 'page');
    const result = spawnSync('pdftoppm', ['-png', '-r', '200', '-l', '3', filePath, prefix], {
      timeout: 60000
    });
    if (result.status !== 0) {
      // pdftoppm not available, try ImageMagick
      spawnSync('convert', ['-density', '200', `${filePath}[0-2]`, `${prefix}-%d.png`], { timeout: 60000 });
    }

    const pages = fs.readdirSync(tmpDir).filter(f => f.endsWith('.png')).sort();
    let fullText = '';
    for (const page of pages.slice(0, 3)) { // OCR first 3 pages
      const pageText = await ocrImage(path.join(tmpDir, page));
      fullText += pageText + '\n';
    }
    return { text: fullText.trim(), source: 'scanned_pdf_ocr', pages: pages.length };
  } finally {
    // Cleanup temp files
    try { fs.rmSync(tmpDir, { recursive: true }); } catch {}
  }
}

// ── Main extractor ───────────────────────────────────────────────────────────
async function extractText(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf' || mimeType === 'application/pdf') {
    return extractPdfText(filePath);
  }
  if (['.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.webp'].includes(ext)) {
    const text = await ocrImage(filePath);
    return { text, source: 'image_ocr', pages: 1 };
  }
  if (ext === '.csv' || ext === '.txt') {
    return { text: fs.readFileSync(filePath, 'utf8'), source: 'text_file', pages: 1 };
  }
  return { text: '', source: 'unsupported', pages: 0 };
}

// ── Field Extractors ─────────────────────────────────────────────────────────

function extractGSTInvoice(text) {
  const t = text.replace(/\s+/g, ' ');
  const fields = {};

  // GSTIN: 15-char alphanumeric
  const gstinMatch = t.match(/\b([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})\b/);
  if (gstinMatch) fields.gstin = gstinMatch[1];

  // Invoice number patterns
  const invMatch = t.match(/(?:invoice\s*(?:no|number|#)?[\s:.]*|inv[\s#-]*)([A-Z0-9/-]{4,20})/i);
  if (invMatch) fields.invoiceNo = invMatch[1].trim();

  // Date patterns: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const dateMatch = t.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);
  if (dateMatch) fields.invoiceDate = dateMatch[1];

  // Amount/Total - look for numbers after total/amount keywords
  const totalMatch = t.match(/(?:total\s*(?:amount)?|grand\s*total|payable)[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (totalMatch) fields.totalValue = parseFloat(totalMatch[1].replace(/,/g, ''));

  // Taxable value
  const taxableMatch = t.match(/(?:taxable\s*(?:value|amount)|basic\s*amount)[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (taxableMatch) fields.taxableValue = parseFloat(taxableMatch[1].replace(/,/g, ''));

  // GST amounts
  const cgstMatch = t.match(/CGST[\s@%\d.]*[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (cgstMatch) fields.cgst = parseFloat(cgstMatch[1].replace(/,/g, ''));

  const sgstMatch = t.match(/SGST[\s@%\d.]*[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (sgstMatch) fields.sgst = parseFloat(sgstMatch[1].replace(/,/g, ''));

  const igstMatch = t.match(/IGST[\s@%\d.]*[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (igstMatch) fields.igst = parseFloat(igstMatch[1].replace(/,/g, ''));

  return fields;
}

function extractBankStatement(text) {
  const t = text.replace(/\s+/g, ' ');
  const fields = {};

  // Account number
  const accMatch = t.match(/(?:account\s*(?:no|number|#)?[\s:.]*|a\/c\s*no[\s:.]*)([\dX]{9,18})/i);
  if (accMatch) fields.accountNo = accMatch[1];

  // Bank name detection
  const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'BOI', 'Canara', 'Union', 'Yes Bank', 'IndusInd'];
  for (const bank of banks) {
    if (t.toLowerCase().includes(bank.toLowerCase())) { fields.bankName = bank; break; }
  }

  // Period
  const periodMatch = t.match(/(?:from|period|statement)[\s:]*(\w+\s*\d{4})\s*(?:to|-)\s*(\w+\s*\d{4})/i);
  if (periodMatch) fields.period = `${periodMatch[1]} to ${periodMatch[2]}`;

  // Opening/Closing balance
  const openMatch = t.match(/opening\s*balance[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (openMatch) fields.openingBalance = parseFloat(openMatch[1].replace(/,/g, ''));

  const closeMatch = t.match(/closing\s*balance[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (closeMatch) fields.closingBalance = parseFloat(closeMatch[1].replace(/,/g, ''));

  return fields;
}

function extractForm16(text) {
  const t = text.replace(/\s+/g, ' ');
  const fields = {};

  // TAN: 10-char format like ABCD12345E
  const tanMatch = t.match(/\b([A-Z]{4}[0-9]{5}[A-Z]{1})\b/);
  if (tanMatch) fields.employerTAN = tanMatch[1];

  // PAN: 10-char
  const panMatch = t.match(/\b([A-Z]{5}[0-9]{4}[A-Z]{1})\b/);
  if (panMatch) fields.employeePAN = panMatch[1];

  // Assessment Year
  const ayMatch = t.match(/assessment\s*year[\s:]*(\d{4}-\d{2,4})/i);
  if (ayMatch) fields.assessmentYear = ayMatch[1];
  else {
    const yearMatch = t.match(/20\d{2}-\d{2}/);
    if (yearMatch) fields.assessmentYear = yearMatch[0];
  }

  // Gross Salary
  const salaryMatch = t.match(/(?:gross\s*salary|total\s*income)[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (salaryMatch) fields.grossSalary = parseFloat(salaryMatch[1].replace(/,/g, ''));

  // TDS Deducted
  const tdsMatch = t.match(/(?:tds\s*deducted|tax\s*deducted\s*at\s*source|total\s*tds)[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (tdsMatch) fields.tdsDeducted = parseFloat(tdsMatch[1].replace(/,/g, ''));

  return fields;
}

function extractTDSCert(text) {
  const t = text.replace(/\s+/g, ' ');
  const fields = {};

  const tanMatch = t.match(/\b([A-Z]{4}[0-9]{5}[A-Z]{1})\b/);
  if (tanMatch) fields.employerTAN = tanMatch[1];

  const panMatch = t.match(/\b([A-Z]{5}[0-9]{4}[A-Z]{1})\b/);
  if (panMatch) fields.employeePAN = panMatch[1];

  const ayMatch = t.match(/assessment\s*year[\s:]*(\d{4}-\d{2,4})/i);
  if (ayMatch) fields.assessmentYear = ayMatch[1];

  const amtMatch = t.match(/(?:amount\s*paid|credited)[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (amtMatch) fields.amount = parseFloat(amtMatch[1].replace(/,/g, ''));

  const tdsMatch = t.match(/(?:tds|tax\s*deducted)[\s:₹Rs.]*([0-9,]+(?:\.\d{2})?)/i);
  if (tdsMatch) fields.tdsDeducted = parseFloat(tdsMatch[1].replace(/,/g, ''));

  return fields;
}

function extractGeneric(text) {
  const t = text.replace(/\s+/g, ' ');
  const fields = {};

  // Try to find any date
  const dateMatch = t.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);
  if (dateMatch) fields.documentDate = dateMatch[1];

  // Try to find any rupee amount
  const amtMatch = t.match(/(?:₹|Rs\.?|INR)\s*([0-9,]+(?:\.\d{2})?)/i);
  if (amtMatch) fields.amount = parseFloat(amtMatch[1].replace(/,/g, ''));

  // Any PAN/TAN
  const panMatch = t.match(/\b([A-Z]{5}[0-9]{4}[A-Z]{1})\b/);
  if (panMatch) fields.panNumber = panMatch[1];

  return fields;
}

// ── Smart classifier from OCR text ──────────────────────────────────────────
function classifyFromText(text, filenameHint) {
  const t = text.toLowerCase();
  const f = filenameHint.toLowerCase();

  // Filename hints first
  if (f.includes('form16') || f.includes('form_16') || f.includes('form-16')) return 'form_16';
  if (f.includes('bank') || f.includes('statement') || f.includes('passbook')) return 'bank_statement';
  if (f.includes('tds') || f.includes('26as')) return 'tds_certificate';
  if (f.includes('itr') || f.includes('acknowledgement')) return 'itr_acknowledgement';

  // Content-based classification
  if (t.includes('form 16') || t.includes('form no. 16') || (t.includes('tds') && t.includes('salary'))) return 'form_16';
  if (t.match(/[0-9]{2}[a-z]{5}[0-9]{4}[a-z]{1}[1-9a-z]{1}z[0-9a-z]{1}/i) && t.includes('invoice')) return 'gst_invoice';
  if (t.includes('bank') && (t.includes('balance') || t.includes('credit') || t.includes('debit'))) return 'bank_statement';
  if (t.includes('tds certificate') || t.includes('tax deducted at source') || t.includes('form 16a')) return 'tds_certificate';
  if (t.includes('profit') && t.includes('loss') || t.includes('balance sheet')) return 'balance_sheet';
  if (t.includes('salary') || t.includes('payslip') || t.includes('ctc')) return 'salary_slip';
  if (t.includes('acknowledgement') || t.includes('receipt number') || t.includes('itr')) return 'itr_acknowledgement';
  if (t.includes('invoice') || t.includes('gst') || t.includes('cgst') || t.includes('sgst')) return 'gst_invoice';

  return 'other';
}

// ── Main OCR function called by controller ───────────────────────────────────
async function performOCR(filePath, mimeType, originalFileName) {
  const startTime = Date.now();
  let ocrText = '';
  let ocrSource = 'none';
  let pages = 0;

  try {
    const result = await extractText(filePath, mimeType);
    ocrText = result.text || '';
    ocrSource = result.source;
    pages = result.pages;
  } catch (err) {
    console.error('[OCR] Extraction error:', err.message);
    return { extractedData: {}, ocrText: '', documentType: 'other', ocrSource: 'error', confidence: 0 };
  }

  // Classify document from text + filename
  const documentType = ocrText.length > 20
    ? classifyFromText(ocrText, originalFileName)
    : classifyFromFilename(originalFileName);

  // Extract structured fields based on document type
  let extractedData = {};
  switch (documentType) {
    case 'gst_invoice':    extractedData = extractGSTInvoice(ocrText); break;
    case 'bank_statement': extractedData = extractBankStatement(ocrText); break;
    case 'form_16':        extractedData = extractForm16(ocrText); break;
    case 'tds_certificate':extractedData = extractTDSCert(ocrText); break;
    default:               extractedData = extractGeneric(ocrText); break;
  }

  const fieldsFound = Object.keys(extractedData).length;
  const confidence = fieldsFound > 3 ? 0.9 : fieldsFound > 1 ? 0.7 : fieldsFound > 0 ? 0.5 : 0.2;
  const processingMs = Date.now() - startTime;

  console.log(`[OCR] ${originalFileName}: type=${documentType}, fields=${fieldsFound}, source=${ocrSource}, time=${processingMs}ms`);

  return { extractedData, documentType, ocrText: ocrText.substring(0, 500), ocrSource, confidence, processingMs };
}

function classifyFromFilename(filename) {
  const f = filename.toLowerCase();
  if (f.includes('form16') || f.includes('form_16')) return 'form_16';
  if (f.includes('gst') && f.includes('invoice')) return 'gst_invoice';
  if (f.includes('bank') || f.includes('statement')) return 'bank_statement';
  if (f.includes('tds') || f.includes('26as')) return 'tds_certificate';
  if (f.includes('itr') || f.includes('ack')) return 'itr_acknowledgement';
  if (f.includes('balance') || f.includes('pnl')) return 'balance_sheet';
  if (f.includes('salary') || f.includes('payslip')) return 'salary_slip';
  return 'other';
}

module.exports = { performOCR };
