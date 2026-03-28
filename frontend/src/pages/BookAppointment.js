import React, { useState } from 'react';
import SEO from '../components/common/SEO';
import { getAvailableSlots, bookAppointment } from '../utils/api';
import { Calendar, Clock, CheckCircle, ArrowRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const SERVICES = ['Income Tax Filing','GST Registration & Filing','Company Registration','Audit & Assurance','Tax Planning','Other'];
const toDateStr = (d) => d.toISOString().split('T')[0];

function getNext30Days() {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) days.push(d);
  }
  return days;
}

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [sameWA, setSameWA] = useState(true);
  const [form, setForm] = useState({ name:'', email:'', phone:'', whatsapp:'', service:'', message:'' });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slots, setSlots] = useState({ available:[], booked:[] });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const days = getNext30Days();

  const selectDate = async (d) => {
    setSelectedDate(d); setSelectedSlot(''); setLoadingSlots(true);
    try {
      const res = await getAvailableSlots(toDateStr(d));
      setSlots({ available: res.data.availableSlots || [], booked: res.data.bookedSlots || [] });
    } catch { setSlots({ available:[], booked:[] }); }
    finally { setLoadingSlots(false); }
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => {
      const updated = { ...f, [name]: value };
      // keep whatsapp in sync with phone if sameWA
      if (name === 'phone' && sameWA) updated.whatsapp = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.service) { toast.error('Fill all required fields'); return; }
    setSubmitting(true);
    try {
      const payload = { ...form, whatsapp: sameWA ? form.phone : (form.whatsapp || form.phone), date: toDateStr(selectedDate), timeSlot: selectedSlot };
      await bookAppointment(payload);
      setDone(true);
      toast.success('Appointment booked! Confirmation sent to your WhatsApp.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (done) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full mx-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked! 🎉</h2>
        <p className="text-gray-500 mb-4">
          Confirmation sent to <strong>{form.email}</strong>
          {(form.whatsapp || form.phone) && <> and WhatsApp <strong>{sameWA ? form.phone : form.whatsapp}</strong></>}.
        </p>
        <div className="bg-blue-50 rounded-xl p-4 mb-5 text-left text-sm space-y-1">
          <p><span className="font-semibold text-gray-700">Date:</span> {selectedDate?.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
          <p><span className="font-semibold text-gray-700">Time:</span> {selectedSlot}</p>
          <p><span className="font-semibold text-gray-700">Service:</span> {form.service}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 mb-5 text-sm text-green-800">
          💬 You'll receive a WhatsApp confirmation shortly. Our team will also confirm within 1 hour.
        </div>
        <a href="/" className="btn-primary justify-center">Back to Home</a>
      </div>
    </div>
  );

  return (
    <>
      <SEO title="Book Appointment" description="Schedule a free 30-minute consultation with our CA experts in Mumbai. Pick a date and time that works for you." canonical="/book-appointment" />

      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily:"'Playfair Display', serif" }}>Book an Appointment</h1>
          <p className="text-blue-100">Schedule a free 30-minute consultation. Confirmation sent on WhatsApp.</p>
          <div className="flex justify-center items-center gap-3 mt-8">
            {[1,2,3].map(s => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center ${step >= s ? 'bg-amber-400 text-blue-900' : 'bg-blue-700 text-blue-300'}`}>{s}</div>
                {s < 3 && <div className={`h-0.5 w-12 ${step > s ? 'bg-amber-400' : 'bg-blue-700'}`} />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center gap-16 mt-2 text-xs text-blue-300">
            <span>Pick Date & Time</span><span>Your Details</span><span>Confirm</span>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">

          {/* Step 1: Date & Slot */}
          {step === 1 && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-700" /> Select Date</h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 mb-6">
                {days.map(d => (
                  <button key={d.toISOString()} onClick={() => selectDate(d)}
                    className={`rounded-xl p-2 text-center text-xs font-medium transition-all ${selectedDate && toDateStr(selectedDate) === toDateStr(d) ? 'bg-blue-700 text-white shadow-md' : 'bg-gray-100 hover:bg-blue-50 text-gray-700 border border-gray-200'}`}>
                    <p className="text-gray-400 text-xs">{d.toLocaleDateString('en',{weekday:'short'})}</p>
                    <p className="font-bold mt-0.5 text-sm">{d.getDate()}</p>
                    <p className="text-gray-400 text-xs">{d.toLocaleDateString('en',{month:'short'})}</p>
                  </button>
                ))}
              </div>
              {selectedDate && (
                <>
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-700" /> Available Time Slots</h3>
                  {loadingSlots ? <div className="text-center py-4 text-gray-400 text-sm">Loading slots...</div> : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.available.map(slot => (
                        <button key={slot} onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all ${selectedSlot === slot ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-700'}`}>
                          {slot}
                        </button>
                      ))}
                      {slots.booked.map(slot => (
                        <button key={slot} disabled className="py-2.5 px-3 rounded-lg text-sm font-medium border bg-gray-50 text-gray-300 border-gray-100 line-through cursor-not-allowed">{slot}</button>
                      ))}
                      {slots.available.length === 0 && !loadingSlots && (
                        <p className="col-span-4 text-gray-400 text-sm py-3">No slots available for this date. Please select another date.</p>
                      )}
                    </div>
                  )}
                </>
              )}
              <div className="mt-6 flex justify-end">
                <button disabled={!selectedDate || !selectedSlot} onClick={() => setStep(2)} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="card">
              <div className="bg-blue-50 rounded-xl p-3 mb-6 text-sm text-blue-800 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <strong>{selectedDate?.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</strong> at <strong>{selectedSlot}</strong>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-5">Your Details</h2>
              <div className="space-y-4">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input name="name" type="text" value={form.name} onChange={handleFormChange} placeholder="Your full name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Phone + WhatsApp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleFormChange} placeholder="+91 98765 43210"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      💬 WhatsApp <span className="text-green-600 text-xs font-normal">(confirmation sent here)</span>
                    </label>
                    <input name="whatsapp" type="tel"
                      value={sameWA ? form.phone : form.whatsapp}
                      onChange={handleFormChange}
                      disabled={sameWA}
                      placeholder="+91 98765 43210"
                      className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${sameWA ? 'bg-gray-50 text-gray-400' : ''}`}
                    />
                    <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                      <input type="checkbox" checked={sameWA} onChange={e => {
                        setSameWA(e.target.checked);
                        if (e.target.checked) setForm(f => ({ ...f, whatsapp: f.phone }));
                      }} className="rounded border-gray-300 text-green-600" />
                      <span className="text-xs text-gray-500">Same as phone number</span>
                    </label>
                  </div>
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Required *</label>
                  <select name="service" value={form.service} onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select...</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                  <textarea name="message" value={form.message} onChange={handleFormChange} rows={3} placeholder="Brief description of your requirement..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="btn-outline text-sm">← Back</button>
                <button onClick={() => {
                  if (!form.name || !form.email || !form.phone || !form.service) { toast.error('Fill all required fields'); return; }
                  setStep(3);
                }} className="btn-primary text-sm">Review Booking <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Confirm Your Appointment</h2>
              <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-6 text-sm">
                {[
                  ['Date', selectedDate?.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})],
                  ['Time', selectedSlot],
                  ['Service', form.service],
                  ['Name', form.name],
                  ['Email', form.email],
                  ['Phone', form.phone],
                  ['WhatsApp', sameWA ? `${form.phone} (same as phone)` : (form.whatsapp || form.phone)],
                  ...(form.message ? [['Message', form.message]] : []),
                ].map(([k,v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="font-semibold text-gray-600 w-24 flex-shrink-0">{k}:</span>
                    <span className="text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 rounded-xl p-3 mb-5 text-sm text-green-800">
                💬 A WhatsApp confirmation will be sent to <strong>{sameWA ? form.phone : (form.whatsapp || form.phone)}</strong>
              </div>
              <p className="text-xs text-gray-400 mb-5">By confirming, you agree to our terms. Our CA team will confirm within 1 hour.</p>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="btn-outline text-sm">← Edit Details</button>
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm disabled:opacity-50">
                  {submitting ? <><Loader className="w-4 h-4 animate-spin" /> Booking...</> : <><CheckCircle className="w-4 h-4" /> Confirm Booking</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
