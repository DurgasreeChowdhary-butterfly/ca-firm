import React, { useState } from 'react';
import { MessageCircle, X, ChevronDown } from 'lucide-react';

const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210';
const SERVICES = [
  'Income Tax Filing',
  'GST Registration & Filing',
  'Company Registration',
  'Audit & Assurance',
  'Tax Planning',
  'General Inquiry',
];

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  const openChat = (service) => {
    const msg = encodeURIComponent(`Hello! I need help with ${service}. Please guide me.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup menu */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 overflow-hidden animate-fadeInUp">
          <div className="bg-green-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-semibold text-sm">Chat on WhatsApp</p>
                <p className="text-green-100 text-xs">Typically replies in minutes</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-500 mb-2 px-1">Select a service to start chatting:</p>
            <div className="space-y-1">
              {SERVICES.map(service => (
                <button
                  key={service}
                  onClick={() => openChat(service)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-300/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        {open
          ? <ChevronDown className="w-6 h-6" />
          : <MessageCircle className="w-6 h-6" />
        }
      </button>

      {/* Pulse ring when closed */}
      {!open && (
        <div className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-green-500 opacity-30 animate-ping pointer-events-none" />
      )}
    </div>
  );
}
