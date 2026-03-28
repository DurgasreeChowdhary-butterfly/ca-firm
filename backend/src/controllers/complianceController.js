const ComplianceQuery = require('../models/ComplianceQuery');
const { sendWhatsApp, templates } = require('../utils/whatsapp');
const { sendLeadNotification } = require('../utils/email');

function classifyQuery(query) {
  const q = query.toLowerCase();
  if (q.includes('gst') || q.includes('gstin') || q.includes('gstr') || q.includes('input tax') || q.includes('itc')) return 'GST';
  if (q.includes('itr') || q.includes('income tax') || q.includes('return') || q.includes('80c')) return 'ITR';
  if (q.includes('tds') || q.includes('26q') || q.includes('tan') || q.includes('deduct')) return 'TDS';
  if (q.includes('audit') || q.includes('statutory') || q.includes('balance sheet')) return 'Audit';
  if (q.includes('company') || q.includes('mca') || q.includes('roc') || q.includes('director')) return 'Company Law';
  return 'General';
}

const KB = {
  GST: {
    answers: [
      { trigger: ['gstr-1', 'gstr1', 'outward supply'], answer: 'GSTR-1 is the return for outward supplies. For taxpayers with turnover > ₹5 crore, it must be filed monthly by the 11th of the following month. Under QRMP scheme (turnover ≤ ₹5 crore), it is filed quarterly by the 13th of the month following the quarter end.', citations: [{ source: 'CBIC Notification 82/2020', section: 'Rule 59 CGST Rules', url: 'https://www.cbic.gov.in' }] },
      { trigger: ['gstr-3b', 'gstr3b', 'monthly payment'], answer: 'GSTR-3B is the monthly self-declaration return. For taxpayers with turnover > ₹5 crore, the due date is the 20th of the following month. For turnover ≤ ₹5 crore, it varies by state (22nd or 24th). Interest @ 18% p.a. is charged for late payment.', citations: [{ source: 'Section 50 CGST Act', section: 'Rule 61', url: 'https://www.cbic.gov.in' }] },
      { trigger: ['itc', 'input tax credit', 'reverse'], answer: 'Input Tax Credit (ITC) can be claimed on goods/services used for business. Key conditions: (1) Tax invoice must exist, (2) Goods/services must be received, (3) Supplier must have filed their return and paid tax, (4) Claim within the earlier of annual return filing date or November 30th of next FY.', citations: [{ source: 'Section 16 CGST Act 2017', section: 'Section 16(2)', url: 'https://www.cbic.gov.in' }] },
      { trigger: ['composition', 'small business'], answer: 'Composition scheme is available for taxpayers with aggregate turnover up to ₹1.5 crore. Tax rates: 1% for traders, 2% for manufacturers, 5% for restaurants. Cannot claim ITC. Must file CMP-08 quarterly.', citations: [{ source: 'Section 10 CGST Act', section: 'CGST Rules 2017', url: 'https://www.cbic.gov.in' }] },
    ]
  },
  ITR: {
    answers: [
      { trigger: ['80c', 'deduction', 'investment'], answer: 'Section 80C allows deductions up to ₹1.5 lakh per year. Eligible investments: PPF, ELSS mutual funds, NSC, tax-saving FDs (5-year), EPF contribution, life insurance premium, tuition fees, home loan principal repayment. Not available under new tax regime.', citations: [{ source: 'Section 80C Income Tax Act 1961', section: 'Chapter VI-A', url: 'https://www.incometaxindia.gov.in' }] },
      { trigger: ['advance tax', 'installment', '234b', '234c'], answer: 'Advance Tax must be paid in 4 installments if tax liability exceeds ₹10,000: 15% by June 15, 45% by Sept 15, 75% by Dec 15, 100% by March 15. Interest under Section 234B (1% p.m.) applies for shortfall.', citations: [{ source: 'Section 208 & 234B/C Income Tax Act', section: 'Chapter XVII-C', url: 'https://www.incometaxindia.gov.in' }] },
      { trigger: ['new regime', 'old regime', 'tax slab', 'which regime'], answer: 'New Tax Regime FY 2024-25: ₹0-3L: Nil, ₹3-7L: 5%, ₹7-10L: 10%, ₹10-12L: 15%, ₹12-15L: 20%, Above ₹15L: 30%. Standard deduction ₹75,000 available. No 80C/80D deductions. New regime is now the default.', citations: [{ source: 'Finance Act 2024', section: 'Section 115BAC', url: 'https://www.incometaxindia.gov.in' }] },
    ]
  },
  TDS: {
    answers: [
      { trigger: ['tds rate', 'section 194', 'salary', 'professional'], answer: 'Key TDS rates: Salary (192): As per slab, Professional fees (194J): 10%, Contract (194C): 2%, Rent >₹50K/month (194IB): 5%, Property purchase >₹50L (194IA): 1%, Commission (194H): 5%, Bank Interest (194A): 10%.', citations: [{ source: 'Income Tax Act 1961', section: 'Chapter XVII-B', url: 'https://www.incometaxindia.gov.in' }] },
      { trigger: ['tds return', '26q', '24q', 'quarterly'], answer: 'TDS Returns: 24Q (Salary), 26Q (Non-salary). Due dates: Q1 (Apr-Jun): July 31, Q2 (Jul-Sep): Oct 31, Q3 (Oct-Dec): Jan 31, Q4 (Jan-Mar): May 31. Late filing fee ₹200/day under Section 234E.', citations: [{ source: 'Section 200 & 234E Income Tax Act', section: 'Rule 31A', url: 'https://www.incometaxindia.gov.in' }] },
    ]
  },
  General: { answers: [{ trigger: [], answer: 'Thank you for your compliance query. Our CA team will review and respond within 24 hours. For immediate assistance, please call us at +91 98765 43210 or WhatsApp us. You can also book a free consultation through our appointment system.', citations: [] }] }
};

function findAnswer(query, category) {
  const q = query.toLowerCase();
  const categoryKB = KB[category] || KB.General;
  for (const entry of categoryKB.answers) {
    if (entry.trigger.length === 0) continue;
    if (entry.trigger.some(t => q.includes(t))) return { answer: entry.answer, citations: entry.citations };
  }
  for (const cat of Object.values(KB)) {
    for (const entry of cat.answers) {
      if (entry.trigger.some(t => q.includes(t))) return { answer: entry.answer, citations: entry.citations };
    }
  }
  return { answer: KB.General.answers[0].answer, citations: [] };
}

// POST /api/compliance/query — public
const submitQuery = async (req, res, next) => {
  try {
    const { clientName, clientEmail, clientPhone, clientWhatsapp, query } = req.body;
    if (!clientName || !query) return res.status(400).json({ success: false, message: 'Name and query are required' });

    const category = classifyQuery(query);
    const { answer, citations } = findAnswer(query, category);
    const hasAIAnswer = citations.length > 0;

    const record = await ComplianceQuery.create({
      clientName, clientEmail, clientPhone, clientWhatsapp, query, category,
      answer, citations,
      status: hasAIAnswer ? 'answered' : 'pending',
      answeredBy: hasAIAnswer ? 'AI Engine' : 'Pending CA Review',
    });

    // Send WhatsApp notification if phone provided
    const waNumber = clientWhatsapp || clientPhone;
    if (waNumber && hasAIAnswer) {
      sendWhatsApp(waNumber, templates.complianceAnswered(clientName, query, answer, citations)).catch(() => {});
    }

    // Notify CA team via email
    if (process.env.EMAIL_USER) {
      sendLeadNotification({
        name: clientName, email: clientEmail, phone: clientPhone || clientWhatsapp,
        service: `Compliance Query: ${category}`, message: query
      }).catch(() => {});
    }

    res.status(201).json({
      success: true,
      data: {
        id: record._id, category, answer, citations,
        status: record.status, answeredBy: record.answeredBy,
        notified: !!waNumber,
      }
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

// PUT /api/admin/compliance/:id — CA answers and sends notification
const updateQuery = async (req, res, next) => {
  try {
    const { answer, caReviewNote, status } = req.body;
    const query = await ComplianceQuery.findByIdAndUpdate(req.params.id,
      { answer, caReviewNote, status, answeredBy: req.admin?.name || 'CA Team' },
      { new: true }
    );
    if (!query) return res.status(404).json({ success: false, message: 'Query not found' });

    // Send WhatsApp + email to client when CA answers
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
