const ComplianceQuery = require('../models/ComplianceQuery');
const { sendWhatsApp, templates } = require('../utils/whatsapp');
const { sendLeadNotification } = require('../utils/email');
const { askClaude } = require('../utils/aiEngine');

// ── Classify query category from keywords ────────────────────────────────────
function classifyQuery(q) {
  const t = q.toLowerCase();
  if (t.includes('gst') || t.includes('gstin') || t.includes('gstr') || t.includes('input tax') || t.includes('itc') || t.includes('invoice') || t.includes('e-way') || t.includes('eway')) return 'GST';
  if (t.includes('income tax') || t.includes('itr') || t.includes('return') || t.includes('80c') || t.includes('80d') || t.includes('capital gain') || t.includes('tax slab') || t.includes('refund') || t.includes('advance tax')) return 'ITR';
  if (t.includes('tds') || t.includes('tcs') || t.includes('26q') || t.includes('24q') || t.includes('tan') || t.includes('deduct') || t.includes('form 16') || t.includes('26as')) return 'TDS';
  if (t.includes('audit') || t.includes('statutory') || t.includes('balance sheet') || t.includes('profit')) return 'Audit';
  if (t.includes('company') || t.includes('mca') || t.includes('roc') || t.includes('director') || t.includes('llp') || t.includes('opc') || t.includes('incorporation')) return 'Company Law';
  if (t.includes('pan') || t.includes('aadhaar') || t.includes('registration') || t.includes('msme')) return 'General';
  return 'General';
}

// ── Keyword fallback KB (used only when Claude API key not set) ───────────────
const KB_FALLBACK = [
  {
    triggers: ['gstr-1', 'gstr1', 'outward supply'],
    answer: 'GSTR-1 reports outward supplies. Monthly filers (turnover > ₹5Cr): due by 11th of next month. QRMP filers (turnover ≤ ₹5Cr): due by 13th after quarter end. Non-filing attracts late fee of ₹200/day (max ₹10,000).',
    citations: [{ source: 'Rule 59 CGST Rules', section: 'CBIC Notification 82/2020' }],
  },
  {
    triggers: ['gstr-3b', 'gstr3b', '3b'],
    answer: 'GSTR-3B is the monthly self-declaration return. Due by 20th of next month (turnover > ₹5Cr) or 22nd/24th (≤ ₹5Cr, varies by state). Interest @ 18% p.a. applies on late payment of tax.',
    citations: [{ source: 'Rule 61 CGST Rules', section: 'Section 50 CGST Act' }],
  },
  {
    triggers: ['itc', 'input tax credit', 'claim itc'],
    answer: 'ITC is claimable when: (1) you have a valid tax invoice, (2) goods/services are received, (3) supplier has filed returns and paid tax, (4) you claim before November 30th of next FY or annual return filing, whichever is earlier.',
    citations: [{ source: 'Section 16(2) CGST Act 2017', section: 'CGST Rules' }],
  },
  {
    triggers: ['80c', 'section 80c', 'tax saving investment'],
    answer: 'Section 80C allows deductions up to ₹1.5 lakh. Eligible: PPF, ELSS, NSC, tax-saving FD (5yr), EPF, life insurance premium, tuition fees, home loan principal. Available only under old tax regime.',
    citations: [{ source: 'Section 80C Income Tax Act 1961', section: 'Chapter VI-A' }],
  },
  {
    triggers: ['new regime', 'old regime', 'tax slab', 'which regime'],
    answer: 'New Regime FY 2024-25 slabs: ₹0-3L: Nil, ₹3-7L: 5%, ₹7-10L: 10%, ₹10-12L: 15%, ₹12-15L: 20%, Above ₹15L: 30%. Standard deduction ₹75,000 available. New regime is default from FY 2024-25.',
    citations: [{ source: 'Section 115BAC Income Tax Act', section: 'Finance Act 2024' }],
  },
  {
    triggers: ['tds rate', 'tds on', 'section 194'],
    answer: 'Key TDS rates: Salary (192): as per slab; Professional fees (194J): 10%; Contractor (194C): 2%; Rent >₹50K/mo (194IB): 5%; Property >₹50L (194IA): 1%; Commission (194H): 5%; Bank interest (194A): 10%.',
    citations: [{ source: 'Income Tax Act 1961', section: 'Chapter XVII-B' }],
  },
  {
    triggers: ['advance tax', '234b', '234c'],
    answer: 'Advance tax is due in 4 instalments if total tax liability > ₹10,000: 15% by Jun 15, 45% by Sep 15, 75% by Dec 15, 100% by Mar 15. Interest @ 1% p.m. under Section 234B for shortfall, 234C for deferment.',
    citations: [{ source: 'Section 208, 234B, 234C Income Tax Act', section: 'Chapter XVII-C' }],
  },
  {
    triggers: ['gst registration', 'register gst', 'gstin'],
    answer: 'GST registration is mandatory when: aggregate turnover exceeds ₹40L (goods) or ₹20L (services). Voluntary registration is allowed below threshold. Process is online via GST portal, takes 3-7 working days. Documents: PAN, Aadhaar, address proof, bank statement.',
    citations: [{ source: 'Section 22 CGST Act 2017', section: 'GST Registration Rules' }],
  },
];

function keywordAnswer(query) {
  const q = query.toLowerCase();
  for (const entry of KB_FALLBACK) {
    if (entry.triggers.some(t => q.includes(t))) {
      return { answer: entry.answer, citations: entry.citations };
    }
  }
  return null;
}

// ── POST /api/compliance/query — main handler ─────────────────────────────────
const submitQuery = async (req, res, next) => {
  try {
    const { clientName, clientEmail, clientPhone, clientWhatsapp, query } = req.body;
    if (!clientName || !query) return res.status(400).json({ success: false, message: 'Name and query are required' });

    const category = classifyQuery(query);
    let answer = '';
    let citations = [];
    let answeredBy = 'Pending CA Review';
    let status = 'pending';

    // 1. Try Claude AI first
    const aiResult = await askClaude(query, category);
    if (aiResult) {
      answer = aiResult.answer;
      citations = aiResult.citations;
      answeredBy = aiResult.answeredBy;
      status = 'answered';
      console.log(`[Compliance] Claude answered: "${query.substring(0, 50)}..."`);
    } else {
      // 2. Fall back to keyword KB
      const kbResult = keywordAnswer(query);
      if (kbResult) {
        answer = kbResult.answer + '\n\n⚠️ This is general guidance. Consult your CA for advice specific to your situation.';
        citations = kbResult.citations;
        answeredBy = 'AI Engine (Knowledge Base)';
        status = 'answered';
        console.log(`[Compliance] KB answered: "${query.substring(0, 50)}..."`);
      } else {
        // 3. No answer found — route to CA
        answer = 'Our CA team will review your query and respond within 24 hours. For urgent assistance, call +91 98765 43210 or WhatsApp us directly.';
        citations = [];
        answeredBy = 'Pending CA Review';
        status = 'pending';
        console.log(`[Compliance] No answer, routed to CA: "${query.substring(0, 50)}..."`);
      }
    }

    const record = await ComplianceQuery.create({
      clientName, clientEmail, clientPhone, clientWhatsapp,
      query, category, answer, citations, status, answeredBy,
    });

    // WhatsApp notification when answered
    const waNumber = clientWhatsapp || clientPhone;
    if (waNumber && status === 'answered') {
      sendWhatsApp(waNumber, templates.complianceAnswered(clientName, query, answer, citations)).catch(() => {});
    }

    // Email to CA team for all queries
    if (process.env.EMAIL_USER) {
      sendLeadNotification({
        name: clientName, email: clientEmail,
        phone: clientPhone || clientWhatsapp,
        service: `Tax Q&A: ${category}`, message: query,
      }).catch(() => {});
    }

    res.status(201).json({
      success: true,
      data: { id: record._id, category, answer, citations, status, answeredBy, notified: !!waNumber },
    });
  } catch (err) { next(err); }
};

// GET /api/admin/compliance
const getQueries = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    const total = await ComplianceQuery.countDocuments(filter);
    const queries = await ComplianceQuery.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(+limit);
    res.json({ success: true, data: queries, pagination: { total, page: +page, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

// PUT /api/admin/compliance/:id — CA manually answers
const updateQuery = async (req, res, next) => {
  try {
    const { answer, caReviewNote, status } = req.body;
    const query = await ComplianceQuery.findByIdAndUpdate(req.params.id,
      { answer, caReviewNote, status, answeredBy: 'CA Team' },
      { new: true }
    );
    if (!query) return res.status(404).json({ success: false, message: 'Query not found' });

    const waNumber = query.clientWhatsapp || query.clientPhone;
    if (waNumber && answer) {
      sendWhatsApp(waNumber, templates.complianceAnswered(
        query.clientName, query.query, answer, query.citations || []
      )).catch(() => {});
    }

    res.json({ success: true, data: query });
  } catch (err) { next(err); }
};

module.exports = { submitQuery, getQueries, updateQuery };
