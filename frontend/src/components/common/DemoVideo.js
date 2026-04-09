import React from 'react';

const WA_LINK = "https://wa.me/919080134783?text=Hi%20Agnevon%2C%20I%20watched%20the%20demo%20and%20want%20to%20get%20my%20CA%20firm%20website%20set%20up.";

export default function DemoVideo() {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0b1d3a 0%, #1a3a6c 100%)' }}>

      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
        backgroundSize: '28px 28px',
      }} />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: 'rgba(200,151,42,0.15)', border: '1px solid rgba(200,151,42,0.4)', color: '#e8b84b' }}>
            <span style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>▶ 60-Second Demo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
            See How It Works in 60 Seconds
          </h2>
          <p className="text-blue-200 text-base leading-relaxed max-w-xl mx-auto">
            Watch how your CA firm's digital office works — from client enquiry to document upload to appointment booking.
          </p>
        </div>

        {/* Video embed */}
        <div className="relative rounded-2xl overflow-hidden mb-8"
          style={{
            aspectRatio: '16/9',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            border: '1px solid rgba(200,151,42,0.3)',
          }}>
          {/* Gold accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #c8972a, #e8b84b, #c8972a)',
            zIndex: 2,
          }} />
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&color=white"
            title="CA Firm Digital Platform — 60 Second Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-bold px-7 py-3.5 rounded-xl text-base transition-all"
            style={{
              background: '#c8972a', color: '#0b1d3a',
              boxShadow: '0 8px 28px rgba(200,151,42,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e8b84b'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#c8972a'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.524 5.82L.057 23.27a.75.75 0 00.914.914l5.473-1.453A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
            Like what you see? Get yours in 7 days
          </a>
          <p className="text-blue-400 text-sm mt-3">+91 90801 34783 · agnevon.global@gmail.com</p>
        </div>
      </div>
    </section>
  );
}
