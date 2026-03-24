import React, { useState } from 'react';
import { CreditCard, Smartphone, X, ExternalLink, CheckCircle } from 'lucide-react';

// ── UPDATE THESE for your client ──
// Razorpay: Get payment link from razorpay.com/payment-links
// UPI: Their UPI ID e.g. firmname@okicici
const RAZORPAY_LINK = 'https://rzp.io/l/YOUR_LINK'; // Replace with real Razorpay link
const UPI_ID = 'cafirm@okicici'; // Replace with real UPI ID
const UPI_NAME = 'CA Firm';
const PHONE = '+91 98765 43210';

const paymentOptions = [
  {
    id: 'consultation',
    label: 'Consultation Fee',
    amount: '₹500',
    desc: '30-min expert consultation',
    icon: '💬',
  },
  {
    id: 'itr',
    label: 'ITR Filing',
    amount: 'From ₹999',
    desc: 'Income Tax Return filing',
    icon: '📋',
  },
  {
    id: 'gst',
    label: 'GST Filing',
    amount: 'From ₹1,499',
    desc: 'Monthly GST return filing',
    icon: '🧾',
  },
  {
    id: 'retainer',
    label: 'Monthly Retainer',
    amount: 'Custom',
    desc: 'Ongoing CA services',
    icon: '📅',
  },
];

export default function PaymentLinks({ compact = false }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR`;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-3">
        <a
          href={RAZORPAY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
        >
          <CreditCard className="w-4 h-4" />
          Pay via Razorpay
        </a>
        <a
          href={upiDeepLink}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
        >
          <Smartphone className="w-4 h-4" />
          Pay via UPI
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Payment Section */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Easy Payments</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pay Fees Online — Instantly
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              UPI, Cards, Net Banking, Wallets — all accepted. Secure payment via Razorpay.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Razorpay card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Pay via Razorpay</h3>
                  <p className="text-gray-400 text-xs">Cards · Net Banking · UPI · Wallets</p>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {paymentOptions.map(opt => (
                  <div key={opt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{opt.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-blue-700">{opt.amount}</span>
                  </div>
                ))}
              </div>

              <a
                href={RAZORPAY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all"
              >
                <CreditCard className="w-5 h-5" />
                Pay Securely via Razorpay
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
              <p className="text-center text-xs text-gray-400 mt-2">🔒 256-bit SSL encrypted · Powered by Razorpay</p>
            </div>

            {/* UPI card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Pay via UPI</h3>
                  <p className="text-gray-400 text-xs">PhonePe · GPay · Paytm · BHIM</p>
                </div>
              </div>

              {/* UPI QR Code placeholder */}
              <div className="flex flex-col items-center mb-5">
                <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-3 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Smartphone className="w-10 h-10 text-gray-300 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">QR Code</p>
                    <p className="text-xs text-gray-300">Add your UPI QR</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Scan & Pay with any UPI app</p>
              </div>

              {/* UPI ID */}
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-gray-900">{UPI_ID}</p>
                  <button
                    onClick={copyUPI}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    {copied ? <><CheckCircle className="w-3 h-3" /> Copied!</> : 'Copy ID'}
                  </button>
                </div>
              </div>

              <a
                href={upiDeepLink}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all mb-3"
              >
                <Smartphone className="w-5 h-5" />
                Open UPI App to Pay
              </a>

              <p className="text-center text-xs text-gray-400">
                After payment, WhatsApp proof to{' '}
                <a href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210'}`}
                  className="text-green-600 hover:underline">{PHONE}</a>
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {['✅ Instant Payment Confirmation', '🔒 100% Secure & Encrypted', '🧾 GST Invoice Provided', '📞 Support on WhatsApp'].map(badge => (
              <div key={badge} className="text-gray-500 text-sm">{badge}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
