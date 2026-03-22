import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { SERVICES } from '../data';
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';

const CITY = 'Mumbai';
const PHONE_TEL = 'tel:+919876543210';
const PHONE_DISPLAY = '+91 98765 43210';

export default function Services() {
  return (
    <>
      <SEO
        title={`CA Services in ${CITY}`}
        description={`Complete CA services in ${CITY}: Income Tax Filing, GST Registration, Company Registration, Audit & Tax Planning. Expert help for individuals and businesses.`}
        keywords={`CA services ${CITY}, GST filing ${CITY}, ITR filing ${CITY}, company registration ${CITY}, audit ${CITY}`}
        canonical="/services"
      />
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-2">What We Do</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            CA Services in {CITY}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-5">
            Comprehensive financial and compliance solutions for individuals, businesses, and enterprises across {CITY}.
          </p>
          <a href={PHONE_TEL} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
          </a>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {SERVICES.map((service, i) => (
            <div key={service.id} className={`card flex flex-col md:flex-row gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-1/3 flex flex-col items-start justify-center">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h2>
                <p className="text-gray-500 text-sm mb-2">{service.shortDesc}</p>
                <p className="text-xs text-blue-700 font-medium mb-3">📍 Serving {CITY} and surrounding areas</p>
                <div className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full text-sm mb-4">{service.price}</div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/services/${service.id}`} className="btn-primary text-sm">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href={PHONE_TEL} className="btn-outline text-sm">
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600 leading-relaxed mb-5">{service.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-blue-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-3">Not Sure Which Service You Need?</h2>
          <p className="text-blue-200 mb-6">Talk to our {CITY} CA — get personalised guidance completely free.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2">
              Get Free Advice <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={PHONE_TEL} className="border-2 border-white/30 hover:border-white text-white font-semibold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2">
              <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
