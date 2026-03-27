const ComplianceCalendar = require('../models/ComplianceCalendar');

// State-wise staggered GSTR-3B day (for turnover ≤ 5 crore)
const STAGGERED_DAYS = {
  'MH': 20, 'KA': 20, 'DL': 20, 'GJ': 20, 'TN': 20,
  'UP': 22, 'RJ': 22, 'MP': 22, 'WB': 22, 'AP': 22,
  'DEFAULT': 24,
};

function getStaggeredDay(state) { return STAGGERED_DAYS[state] || STAGGERED_DAYS['DEFAULT']; }

// Shift date if it falls on Sunday
function shiftIfSunday(date) {
  const d = new Date(date);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Sunday → Monday
  return d;
}

function getUrgency(dueDate) {
  const now = new Date();
  const diff = (new Date(dueDate) - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'overdue';
  if (diff <= 3) return 'critical';
  if (diff <= 7) return 'urgent';
  if (diff <= 30) return 'upcoming';
  return 'future';
}

// Build FY date range
function getFYMonths(fyString) {
  // fyString: "2025-26"
  const startYear = parseInt(fyString.split('-')[0]);
  const months = [];
  for (let m = 3; m <= 14; m++) {
    const year = m <= 12 ? startYear : startYear + 1;
    const month = m <= 12 ? m : m - 12;
    months.push({ year, month });
  }
  return months; // Apr to Mar (months 3-14 normalized)
}

function nthOfNextMonth(year, month, day) {
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 12) { nextMonth = 1; nextYear++; }
  return shiftIfSunday(new Date(nextYear, nextMonth - 1, day));
}

function calculateDueDates(profile, fyString = '2025-26') {
  const { entityType, turnover, state, hasGST, isComposition, qrmpOptIn,
    auditRequired, tdsApplicable, advanceTaxApplicable } = profile;

  const startYear = parseInt(fyString.split('-')[0]);
  const endYear = startYear + 1;
  const months = getFYMonths(fyString);
  const dates = [];

  // ── GST ──
  if (hasGST) {
    if (isComposition) {
      // CMP-08: Quarterly
      [{ m: 6, y: startYear, period: 'Q1 Apr-Jun' }, { m: 9, y: startYear, period: 'Q2 Jul-Sep' },
       { m: 12, y: startYear, period: 'Q3 Oct-Dec' }, { m: 3, y: endYear, period: 'Q4 Jan-Mar' }]
      .forEach(q => {
        dates.push({ complianceType: 'CMP-08', category: 'GST', period: q.period,
          dueDate: shiftIfSunday(new Date(q.y, q.m - 1, 18)) });
      });

      dates.push({ complianceType: 'GSTR-4', category: 'GST', period: `FY ${fyString}`,
        dueDate: shiftIfSunday(new Date(endYear, 3, 30)) }); // Apr 30

    } else {
      // GSTR-1
      if (qrmpOptIn && turnover <= 50000000) {
        // Quarterly GSTR-1 under QRMP
        [{ m: 6, y: startYear, period: 'Q1' }, { m: 9, y: startYear, period: 'Q2' },
         { m: 12, y: startYear, period: 'Q3' }, { m: 3, y: endYear, period: 'Q4' }]
        .forEach(q => {
          dates.push({ complianceType: 'GSTR-1 (QRMP)', category: 'GST', period: q.period,
            dueDate: nthOfNextMonth(q.y, q.m, 13) });
        });
      } else {
        // Monthly GSTR-1
        months.forEach(({ year, month }) => {
          const monthName = new Date(year, month - 1, 1).toLocaleString('en', { month: 'short', year: 'numeric' });
          dates.push({ complianceType: 'GSTR-1', category: 'GST',
            period: monthName, dueDate: nthOfNextMonth(year, month, 11) });
        });
      }

      // GSTR-3B (monthly for all)
      const gstr3bDay = turnover > 50000000 ? 20 : getStaggeredDay(state);
      months.forEach(({ year, month }) => {
        const monthName = new Date(year, month - 1, 1).toLocaleString('en', { month: 'short', year: 'numeric' });
        dates.push({ complianceType: 'GSTR-3B', category: 'GST',
          period: monthName, dueDate: nthOfNextMonth(year, month, gstr3bDay) });
      });

      // GSTR-9 Annual (if turnover > 2Cr)
      if (turnover > 20000000) {
        dates.push({ complianceType: 'GSTR-9', category: 'GST', period: `FY ${fyString}`,
          dueDate: shiftIfSunday(new Date(endYear, 11, 31)) });
      }
      if (turnover > 50000000) {
        dates.push({ complianceType: 'GSTR-9C', category: 'GST', period: `FY ${fyString}`,
          dueDate: shiftIfSunday(new Date(endYear, 11, 31)) });
      }
    }
  }

  // ── INCOME TAX ──
  // ITR due date
  const itrDue = auditRequired
    ? new Date(endYear, 9, 31)  // Oct 31 for audit cases
    : new Date(endYear, 6, 31); // Jul 31 for non-audit
  dates.push({ complianceType: 'ITR Filing', category: 'ITR',
    period: `FY ${fyString}`, dueDate: shiftIfSunday(itrDue) });

  if (auditRequired) {
    dates.push({ complianceType: 'Tax Audit Report (3CA/3CB)', category: 'ITR',
      period: `FY ${fyString}`, dueDate: shiftIfSunday(new Date(endYear, 8, 30)) }); // Sep 30
  }

  // Advance Tax
  if (advanceTaxApplicable) {
    [
      { date: new Date(startYear, 5, 15), period: 'Installment 1 (15%)' },
      { date: new Date(startYear, 8, 15), period: 'Installment 2 (45%)' },
      { date: new Date(startYear, 11, 15), period: 'Installment 3 (75%)' },
      { date: new Date(endYear, 2, 15), period: 'Installment 4 (100%)' },
    ].forEach(({ date, period }) => {
      dates.push({ complianceType: 'Advance Tax', category: 'ITR',
        period, dueDate: shiftIfSunday(date) });
    });
  }

  // ── TDS ──
  if (tdsApplicable) {
    // TDS Challan: 7th of next month (30 Apr for March)
    months.forEach(({ year, month }) => {
      const monthName = new Date(year, month - 1, 1).toLocaleString('en', { month: 'short', year: 'numeric' });
      const challanDate = (month === 3)
        ? new Date(endYear, 3, 30) // Mar → Apr 30
        : nthOfNextMonth(year, month, 7);
      dates.push({ complianceType: 'TDS Challan', category: 'TDS',
        period: monthName, dueDate: challanDate });
    });

    // TDS Returns Quarterly
    [
      { period: 'Q1 (Apr-Jun)', due: new Date(startYear, 6, 31) },
      { period: 'Q2 (Jul-Sep)', due: new Date(startYear, 9, 31) },
      { period: 'Q3 (Oct-Dec)', due: new Date(endYear, 0, 31) },
      { period: 'Q4 (Jan-Mar)', due: new Date(endYear, 4, 31) },
    ].forEach(({ period, due }) => {
      dates.push({ complianceType: 'TDS Return (26Q)', category: 'TDS',
        period, dueDate: shiftIfSunday(due) });
    });
  }

  // Set urgency and sort
  dates.forEach(d => { d.urgency = getUrgency(d.dueDate); d.originalDueDate = d.dueDate; });
  return dates.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

// POST /api/calendar/generate — generate calendar for client
const generateCalendar = async (req, res, next) => {
  try {
    const { clientName, clientEmail, clientProfile, financialYear = '2025-26' } = req.body;
    if (!clientName || !clientEmail) {
      return res.status(400).json({ success: false, message: 'Client name and email required' });
    }

    const dueDates = calculateDueDates(clientProfile || {}, financialYear);

    // Upsert: one calendar per client per FY
    const calendar = await ComplianceCalendar.findOneAndUpdate(
      { clientEmail, financialYear },
      { clientName, clientEmail, clientProfile, dueDates, financialYear, lastCalculated: new Date() },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: `Generated ${dueDates.length} compliance deadlines for FY ${financialYear}`,
      data: calendar,
    });
  } catch (err) { next(err); }
};

// GET /api/calendar/upcoming — upcoming deadlines across all clients (admin)
const getUpcoming = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    const now = new Date();

    const calendars = await ComplianceCalendar.find({});
    const upcoming = [];
    calendars.forEach(cal => {
      cal.dueDates.forEach(d => {
        if (new Date(d.dueDate) >= now && new Date(d.dueDate) <= cutoff && d.status === 'pending') {
          upcoming.push({
            clientName: cal.clientName,
            clientEmail: cal.clientEmail,
            complianceType: d.complianceType,
            category: d.category,
            period: d.period,
            dueDate: d.dueDate,
            urgency: d.urgency,
          });
        }
      });
    });

    upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    res.json({ success: true, data: upcoming, count: upcoming.length });
  } catch (err) { next(err); }
};

// GET /api/calendar/:email — get calendar for specific client
const getClientCalendar = async (req, res, next) => {
  try {
    const calendar = await ComplianceCalendar.findOne({
      clientEmail: req.params.email,
      financialYear: req.query.fy || '2025-26',
    });
    if (!calendar) return res.status(404).json({ success: false, message: 'No calendar found. Generate one first.' });
    res.json({ success: true, data: calendar });
  } catch (err) { next(err); }
};

// PUT /api/calendar/:calendarId/complete/:dueDateIndex — mark compliance done
const markComplete = async (req, res, next) => {
  try {
    const { completedNote } = req.body;
    const calendar = await ComplianceCalendar.findById(req.params.calendarId);
    if (!calendar) return res.status(404).json({ success: false, message: 'Calendar not found' });
    const idx = parseInt(req.params.dueDateIndex);
    if (calendar.dueDates[idx]) {
      calendar.dueDates[idx].status = 'completed';
      calendar.dueDates[idx].completedAt = new Date();
      calendar.dueDates[idx].completedNote = completedNote;
      await calendar.save();
    }
    res.json({ success: true, message: 'Marked as completed', data: calendar });
  } catch (err) { next(err); }
};

module.exports = { generateCalendar, getUpcoming, getClientCalendar, markComplete };
