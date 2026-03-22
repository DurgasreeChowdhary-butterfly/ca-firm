import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import LeadForm from '../components/common/LeadForm';
import { SERVICES, TESTIMONIALS, STATS, FAQS } from '../data';
import { ArrowRight, CheckCircle, Star, ChevronDown, Award, Shield, Clock, Users } from 'lucide-react';
import { useState } from 'react';

const trustBadges = [
  { icon: Award, label: '15+ Years Experience' },
  { icon: Users, label: '500+ Happy Clients' },
  { icon: Shield, label: '100% Compliance' },
  { icon: Clock, label: '24hr Response' },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <SEO title="Trusted CA Firm in India" description="Professional chartered accountancy services — Income Tax, GST, Company Registration, Audit & Tax Planning. 15+ years of trusted expertise." />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-400 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-500/30 rounded-full px-4 py-2 text-sm text-blue-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Trusted by 500+ Clients Across India
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Expert CA Services <span className="text-amber-400">You Can Trust</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                From income tax filing to company incorporation — we handle all your financial and compliance needs with precision, integrity, and 15+ years of expertise.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/book-appointment" className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-amber-400/30 flex items-center gap-2">
                  Book Free Consultation <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/services" className="border-2 border-white/30 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2">
                  Our Services
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                {['ITR Filed', 'GST Returns', 'Companies Registered', 'Tax Saved'].map((label, i) => (
                  <div key={label} className="text-center">
                    <p className="text-2xl font-bold text-amber-400">{['10K+', '5K+', '200+', '₹2Cr+'][i]}</p>
                    <p className="text-blue-200 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Lead Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Get Free Consultation</h2>
              <p className="text-gray-500 text-sm mb-5">Fill the form and we'll call you back within 2 hours</p>
              <LeadForm compact />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 justify-center py-2">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-700" />
                </div>
                <span className="text-sm font-semibold text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">What We Offer</p>
            <h2 className="section-title">Comprehensive CA Services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From individuals to enterprises, we provide end-to-end financial and compliance solutions tailored to your needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <Link key={service.id} to={`/services/${service.id}`} className="group card hover:border-l-4 hover:border-l-blue-700 transition-all">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{service.title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{service.shortDesc}</p>
                <ul className="space-y-1 mb-4">
                  {service.features.slice(0, 3).map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                  <span className="text-xs font-semibold text-blue-700">{service.price}</span>
                  <span className="text-xs text-blue-700 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Why Choose Us</p>
              <h2 className="section-title">Your Financial Success is Our Priority</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">We combine deep technical expertise with personalised service to deliver outcomes that truly matter to you and your business.</p>
              <div className="space-y-5">
                {[
                  { title: 'Certified Professionals', desc: 'All our CAs are ICAI-certified with specializations in tax, audit, and corporate law.' },
                  { title: 'Personalised Approach', desc: 'No one-size-fits-all solutions. We understand your unique situation and craft strategies accordingly.' },
                  { title: 'Timely Delivery', desc: 'We meet deadlines — always. Your compliance filings are never late with us.' },
                  { title: 'Transparent Pricing', desc: 'Clear fees, no hidden charges. You know exactly what you pay for.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Our Track Record</h3>
              <div className="grid grid-cols-2 gap-6">
                {STATS.map(stat => (
                  <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-amber-400 mb-1">{stat.value}</p>
                    <p className="text-blue-200 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-blue-200 text-sm mb-4">Ready to get started?</p>
                <Link to="/contact" className="block text-center bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-6 py-3 rounded-xl transition-all">
                  Talk to a CA Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Testimonials</p>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">FAQ</p>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Simplify Your Finances?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">Book a free 30-minute consultation with one of our expert CAs today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/book-appointment" className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-8 py-4 rounded-xl transition-all shadow-lg flex items-center gap-2">
              Book Appointment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center gap-2">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
