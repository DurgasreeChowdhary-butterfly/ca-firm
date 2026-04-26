import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { getAvailableSlots, bookAppointment } from '../utils/api';
import { CheckCircle, ArrowRight, Loader, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const SERVICES = [
  'Income Tax Filing', 'GST Registration & Filing', 'Company Registration',
  'Audit & Assurance', 'Tax Planning', 'TDS Filing', 'Other',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ── Full-grid calendar component ──────────────────────────────────────────────
function CalendarGrid({ onSelectDate, selectedDate }) {
  const today       = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  // Restriction: only current month is selectable
  const year  = currentYear;
  const month = currentMonth;

  const firstDay   = new Date(year, month, 1).getDay();   // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr   = toDateStr(today);

  // Build 6-row × 7-col grid
  const cells = [];
  for (let i = 0; i < firstDay; i++)   cells.push(null);           // leading blanks
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0)       cells.push(null);           // trailing blanks

  const isPast    = (day) => { if (!day) return false; const d = new Date(year, month, day); return d < today && toDateStr(d) !== todayStr; };
  const isSunday  = (day) => { if (!day) return false; return new Date(year, month, day).getDay() === 0; };
  const isToday   = (day) => { if (!day) return false; return toDateStr(new Date(year, month, day)) === todayStr; };
  const isSelected = (day) => { if (!day || !selectedDate) return false; return toDateStr(new Date(year, month, day)) === selectedDate; };
  const isDisabled = (day) => !day || isPast(day) || isSunday(day);

  return (
    <div>
      {/* Month Header — fixed, no navigation (only current month allowed) */}
      <div className="flex items-center justify-center mb-5 gap-3">
        <div className="px-4 py-2 bg-blue-50 rounded-xl">
          <span className="font-bold text-blue-900 text-base">
            {MONTH_NAMES[month]} {year}
          </span>
        </div>
        <span className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
          Current month only
        </span>
      </div>

      {/* Day name header */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map(d => (
          <div key={d} className={`text-center text-xs font-bold py-1.5 ${d === 'Sun' ? 'text-red-400' : 'text-gray-400'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          const today_   = isToday(day);
          const sunday   = isSunday(day);

          return (
            <button
              key={idx}
              disabled={disabled || !day}
              onClick={() => day && !disabled && onSelectDate(toDateStr(new Date(year, month, day)))}
              className={`
                relative aspect-square rounded-xl text-sm font-semibold transition-all
                flex items-center justify-center
                ${!day ? 'invisible pointer-events-none' : ''}
                ${selected
                  ? 'bg-blue-700 text-white shadow-lg shadow-blue-200 scale-105 ring-2 ring-blue-300'
                  : disabled
                    ? sunday && day ? 'text-red-300 bg-red-50 cursor-not-allowed'
                    : 'text-gray-300 bg-gray-50 cursor-not-allowed'
                  : today_
                    ? 'bg-amber-50 text-amber-700 border-2 border-amber-300 hover:bg-amber-100'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:scale-105'
                }
              `}
            >
              {day}
              {today_ && !selected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 justify-center flex-wrap">
        {[
          { cls: 'bg-blue-700', label: 'Selected' },
          { cls: 'bg-amber-50 border-2 border-amber-300', label: 'Today' },
          { cls: 'bg-gray-100', label: 'Past / Unavailable' },
          { cls: 'bg-red-50',   label: 'Sunday' },
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded-md ${cls}`} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Time slots ────────────────────────────────────────────────────────────────
function TimeSlotPicker({ selectedDate, selectedSlot, onSelect }) {
  const [slots,   setSlots]   = useState({ available: [], booked: [] });
  const [loading, setLoading] = useState(false);
  const prevDate = React.useRef(null);

  React.useEffect(() => {
    if (!selectedDate || selectedDate === prevDate.current) return;
    prevDate.current = selectedDate;
    setLoading(true);
    getAvailableSlots(selectedDate)
      .then(r => setSlots({ available: r.data.availableSlots || [], booked: r.data.bookedSlots || [] }))
      .catch(() => setSlots({
        available: ['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'],
        booked: ['12:00 PM','1:00 PM'],
      }))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  if (!selectedDate) return null;

  const dateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-blue-600" />
        <p className="font-semibold text-gray-800 text-sm">Available slots for <span className="text-blue-700">{dateLabel}</span></p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
          <Loader className="w-4 h-4 animate-spin" /> Loading slots...
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.available.map(slot => (
            <button key={slot} onClick={() => onSelect(slot)}
              className={`py-2.5 px-2 rounded-xl text-xs font-semibold border-2 transition-all
                ${selectedSlot === slot
                  ? 'bg-blue-700 border-blue-700 text-white shadow-md scale-105'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-700 hover:scale-105'
                }`}>
              {slot}
            </button>
          ))}
          {slots.booked.map(slot => (
            <button key={slot} disabled
              className="py-2.5 px-2 rounded-xl text-xs font-medium border-2 border-gray-100 bg-gray-50 text-gray-300 line-through cursor-not-allowed">
              {slot}
            </button>
          ))}
          {slots.available.length === 0 && (
            <p className="col-span-4 text-sm text-gray-400 py-3 text-center">
              No slots available for this date. Please select another date.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookAppointment() {
  const [step,         setStep]         = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [sameWA,       setSameWA]       = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [done,         setDone]         = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', whatsapp:'', service:'', message:'' });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => {
      const u = { ...f, [name]: value };
      if (name === 'phone' && sameWA) u.whatsapp = value;
      return u;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await bookAppointment({
        ...form,
        whatsapp: sameWA ? form.phone : form.whatsapp,
        date: selectedDate,
        timeSlot: selectedSlot,
      });
      setDone(true);
      toast.success('Appointment booked! WhatsApp confirmation sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  // Step progress dots
  const steps = ['Pick Date & Time', 'Your Details', 'Confirm'];

  if (done) return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-16 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
          Appointment Booked! 🎉
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          Confirmation sent to <strong>{form.email}</strong>
          {(sameWA ? form.phone : form.whatsapp) && <> and WhatsApp <strong>{sameWA ? form.phone : form.whatsapp}</strong></>}.
        </p>
        <div className="bg-blue-50 rounded-2xl p-4 mb-5 text-left text-sm space-y-2">
          {[
            ['Date', new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })],
            ['Time', selectedSlot],
            ['Service', form.service],
          ].map(([k,v]) => (
            <div key={k} className="flex gap-3">
              <span className="font-semibold text-gray-600 w-16 flex-shrink-0">{k}:</span>
              <span className="text-gray-800">{v}</span>
            </div>
          ))}
        </div>
        <Link to="/" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <SEO title="Book Appointment" description="Schedule a free consultation with our CA team in Mumbai." canonical="/book-appointment" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
            Book an Appointment
          </h1>
          <p className="text-blue-200 text-base">Free 30-minute consultation. WhatsApp confirmation sent instantly.</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-0 mt-8">
            {steps.map((label, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > i + 1 ? 'bg-green-400 text-white' :
                    step === i + 1 ? 'bg-amber-400 text-blue-900 scale-110' :
                    'bg-blue-700 text-blue-300'
                  }`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block transition-colors ${step === i + 1 ? 'text-amber-300 font-semibold' : 'text-blue-400'}`}>
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-1 mb-5 transition-colors ${step > i + 1 ? 'bg-green-400' : 'bg-blue-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto px-4">

          {/* ── STEP 1: Calendar + Slots ── */}
          {step === 1 && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Select Date &amp; Time</h2>
              <CalendarGrid selectedDate={selectedDate} onSelectDate={d => { setSelectedDate(d); setSelectedSlot(''); }} />
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
              />
              <div className="mt-8 flex justify-end">
                <button
                  disabled={!selectedDate || !selectedSlot}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm disabled:cursor-not-allowed">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Personal Details ── */}
          {step === 2 && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              {/* Selected date reminder */}
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3 mb-6 text-blue-800 text-sm">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span><strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}</strong> at <strong>{selectedSlot}</strong></span>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-5">Your Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Rajesh Kumar"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      💬 WhatsApp <span className="text-green-600 text-xs font-normal">(confirmation here)</span>
                    </label>
                    <input name="whatsapp" type="tel"
                      value={sameWA ? form.phone : form.whatsapp}
                      onChange={handleChange}
                      disabled={sameWA}
                      placeholder="+91 98765 43210"
                      className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors ${sameWA ? 'border-gray-100 bg-gray-50 text-gray-400' : 'border-gray-200'}`}
                    />
                    <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                      <input type="checkbox" checked={sameWA} onChange={e => { setSameWA(e.target.checked); if (e.target.checked) setForm(f => ({ ...f, whatsapp: f.phone })); }}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-green-600" />
                      <span className="text-xs text-gray-500">Same as phone</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Required <span className="text-red-500">*</span></label>
                  <select name="service" value={form.service} onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 transition-colors">
                    <option value="">Select a service...</option>
                    {SERVICES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message (optional)</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                    placeholder="Brief description of your requirements..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <button onClick={() => setStep(1)}
                  className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  disabled={!form.name || !form.email || !form.phone || !form.service}
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all disabled:cursor-not-allowed">
                  Review Booking <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Confirm Your Appointment</h2>

              <div className="bg-gray-50 rounded-2xl p-5 space-y-3 mb-5 text-sm">
                {[
                  ['Date',     new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })],
                  ['Time',     selectedSlot],
                  ['Service',  form.service],
                  ['Name',     form.name],
                  ['Email',    form.email],
                  ['Phone',    form.phone],
                  ['WhatsApp', sameWA ? `${form.phone} (same as phone)` : (form.whatsapp || form.phone)],
                  ...(form.message ? [['Message', form.message]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="font-semibold text-gray-500 w-24 flex-shrink-0 text-xs uppercase tracking-wide">{k}</span>
                    <span className="text-gray-800">{v}</span>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-sm text-green-800 flex items-center gap-2">
                💬 Confirmation will be sent to WhatsApp <strong>{sameWA ? form.phone : (form.whatsapp || form.phone)}</strong>
              </div>

              <p className="text-xs text-gray-400 mb-5">By confirming, you agree to our terms. Our CA team will confirm within 1 hour on working days.</p>

              <div className="flex items-center justify-between">
                <button onClick={() => setStep(2)}
                  className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Edit
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
                  {submitting ? <><Loader className="w-4 h-4 animate-spin" /> Booking...</> : <><CheckCircle className="w-4 h-4" /> Confirm Booking</>}
                </button>
              </div>
            </div>
          )}

          {/* Call option */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Prefer to call?{' '}
            <a href="tel:+919080134783" className="text-blue-600 font-semibold inline-flex items-center gap-1 hover:underline">
              <Phone className="w-3.5 h-3.5" /> +91 90801 34783
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
