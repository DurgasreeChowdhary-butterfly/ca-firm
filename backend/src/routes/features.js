const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');

// Multer with MEMORY storage — file stored as buffer in req.file.buffer
// Then saved as base64 in MongoDB, so it persists across Render redeploys
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.xlsx', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, images, and spreadsheets are allowed'));
  }
});

// ── Controllers ──
const { submitQuery, getQueries, updateQuery } = require('../controllers/complianceController');
const { uploadDocument, getDocuments, reviewDocument, getDocumentStats, serveFile } = require('../controllers/documentController');
const { generateCalendar, getUpcoming, getClientCalendar, markComplete } = require('../controllers/calendarController');
const { requestMagicLink, validateMagicLink, getMagicLinks, revokeTokens } = require('../controllers/magicLinkController');
const { zohoWebhook, tallyPush, triggerDemoSync, getSyncRecords, getSyncStats, resolveConflictRecord } = require('../controllers/syncController');

// ══════════════════
// FEATURE 1: Compliance / AI Engine
// ══════════════════
router.post('/compliance/query', submitQuery);                         // Public: submit query
router.get('/admin/compliance', protect, getQueries);                  // Admin: list all queries
router.put('/admin/compliance/:id', protect, updateQuery);             // Admin: answer/review

// ══════════════════
// FEATURE 2: Document OCR
// ══════════════════
router.post('/documents/upload', upload.single('document'), uploadDocument);   // Public: upload
router.get('/admin/documents', protect, getDocuments);                         // Admin: list
router.get('/admin/documents/stats', protect, getDocumentStats);               // Admin: stats
router.put('/admin/documents/:id/review', protect, reviewDocument);            // Admin: verify
router.get('/admin/documents/:id/file', protect, serveFile);                   // Admin: preview file

// ══════════════════
// FEATURE 3: Statutory Calendar
// ══════════════════
router.post('/calendar/generate', generateCalendar);                           // Public: generate calendar
router.get('/calendar/:email', getClientCalendar);                             // Public: get client calendar
router.get('/admin/calendar/upcoming', protect, getUpcoming);                  // Admin: upcoming deadlines
router.put('/admin/calendar/:calendarId/complete/:idx', protect, markComplete); // Admin: mark done

// ══════════════════
// FEATURE 4: Magic Link / Passwordless
// ══════════════════
router.post('/magic-link/request', requestMagicLink);                  // Public: request link
router.post('/magic-link/validate', validateMagicLink);                // Public: validate token
router.get('/admin/magic-links', protect, getMagicLinks);              // Admin: view all tokens
router.delete('/admin/magic-links/revoke/:email', protect, revokeTokens); // Admin: revoke

// ══════════════════
// FEATURE 5: Data Sync
// ══════════════════
router.post('/sync/zoho/webhook', zohoWebhook);                        // Webhook: Zoho
router.post('/sync/tally/push', tallyPush);                            // Tally agent push
router.post('/sync/demo/trigger', triggerDemoSync);                    // Demo: simulate sync
router.get('/admin/sync/records', protect, getSyncRecords);            // Admin: all records
router.get('/admin/sync/stats', protect, getSyncStats);                // Admin: health stats
router.put('/admin/sync/:id/resolve', protect, resolveConflictRecord); // Admin: resolve conflict

module.exports = router;
