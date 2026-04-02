import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import LeadForm from '../components/common/LeadForm';
import { SERVICES, TESTIMONIALS, STATS, FAQS } from '../data';
import { ArrowRight, CheckCircle, Star, ChevronDown, Award, Shield, Clock, Users, Phone, ExternalLink } from 'lucide-react';
import GoogleReviews from '../components/common/GoogleReviews';

const PHONE_TEL = 'tel:+919876543210';
const PHONE_DISPLAY = '+91 98765 43210';
const ICAI_NO = 'XXXXXX';
const CITY = 'Mumbai';

const trustBadges = [
  { icon: Award, label: '15+ Years Experience' },
  { icon: Users, label: '500+ Happy Clients' },
  { icon: Shield, label: 'ICAI Registered' },
  { icon: Clock, label: '24hr Response' },
];

const caseStudies = [
  {
    type: 'E-commerce Startup',
    problem: '3-year GST backlog with multiple platforms',
    solution: 'Reconciled all GSTR filings, cleared penalties through appeal',
    result: 'Penalty of ₹2.4L waived, business GST-compliant in 45 days',
    icon: '🛒',
  },
  {
    type: 'Salaried Professional',
    problem: 'Multiple income sources — salary, freelance, capital gains',
    solution: 'Optimised deductions under 80C, 80D, HRA, home loan',
    result: 'Tax liability reduced by ₹87,000 in a single filing year',
    icon: '👔',
  },
  {
    type: 'Manufacturing SME',
    problem: 'Statutory audit due, books unreconciled for 2 years',
    solution: 'Full audit with books cleanup, compliance calendar set up',
    result: 'Clean audit report delivered in 3 weeks, bank loan approved',
    icon: '🏭',
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <SEO
        title={`Trusted CA Firm in ${CITY}`}
        description={`Professional CA services in ${CITY} — Income Tax, GST, Company Registration, Audit & Tax Planning. ICAI No: ${ICAI_NO}. 500+ clients, 15+ years. Call ${PHONE_DISPLAY}.`}
        keywords={`CA firm ${CITY}, GST consultant ${CITY}, income tax ${CITY}, chartered accountant ${CITY}`}
        canonical="/"
        schema={homeSchema}
      />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-400 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-500/30 rounded-full px-4 py-2 text-sm text-blue-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Trusted CA Firm in {CITY} · ICAI No: {ICAI_NO}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Expert CA Services <span className="text-amber-400">in {CITY}</span>
              </h1>
              {/* City + specialty in subheading — critical for local SEO */}
              <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                Serving businesses and individuals in {CITY} for 15+ years. GST filing, Income Tax, Audit, Company Registration — handled with precision and integrity.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <Link to="/book-appointment"
                  className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-amber-400/30 flex items-center gap-2">
                  Book Free Consultation <ArrowRight className="w-4 h-4" />
                </Link>
                {/* WhatsApp CTA — second most important */}
                <a
                  href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210'}?text=Hello%2C%20I%20need%20CA%20services`}
                  target="_blank" rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                >
                  💬 WhatsApp Us Now
                </a>
              </div>
              {/* Phone visible above fold — critical fix */}
              <a href={PHONE_TEL}
                className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 font-semibold text-lg transition-colors">
                <Phone className="w-5 h-5" />
                {PHONE_DISPLAY}
                <span className="text-blue-300 text-sm font-normal">— Click to call</span>
              </a>
              <div className="mt-6 flex flex-wrap gap-6">
                {['10K+ ITRs Filed', '5K+ GST Returns', '200+ Companies', '₹2Cr+ Tax Saved'].map((label, i) => (
                  <div key={label} className="text-center">
                    <p className="text-xl font-bold text-amber-400">{label.split(' ')[0]}</p>
                    <p className="text-blue-200 text-xs">{label.split(' ').slice(1).join(' ')}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Lead Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Get Free Consultation</h2>
              <p className="text-gray-500 text-sm mb-5">Fill the form — we'll call back within 2 hours</p>
              <LeadForm compact />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 justify-center py-1">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
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
            <h2 className="section-title">CA Services in {CITY}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Comprehensive financial and compliance solutions for individuals and businesses across {CITY}.</p>
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
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />{f}
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
            <Link to="/services" className="btn-outline">View All Services <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ── Mid-page CTA Band — breaks monotony, audit recommendation ── */}
      <section className="bg-blue-900 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Not Sure Which Service You Need?
          </h2>
          <p className="text-blue-200 mb-6">Talk to our CA in {CITY} — completely free 30-min consultation.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/book-appointment"
              className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-7 py-3 rounded-xl transition-all flex items-center gap-2">
              Book Free 30-Min Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={PHONE_TEL}
              className="border-2 border-white/40 hover:border-white text-white font-semibold px-7 py-3 rounded-xl transition-all flex items-center gap-2">
              <Phone className="w-4 h-4" /> Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* ── Case Studies — audit said this is the most powerful trust builder ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Real Results</p>
            <h2 className="section-title">Client Success Stories</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Anonymised case studies from our {CITY} clients showing measurable outcomes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((c, i) => (
              <div key={i} className="card border-t-4 border-t-blue-700">
                <div className="text-4xl mb-3">{c.icon}</div>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">{c.type}</p>
                <div className="space-y-3">
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-red-700 mb-1">Problem</p>
                    <p className="text-gray-600 text-sm">{c.problem}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-700 mb-1">What We Did</p>
                    <p className="text-gray-600 text-sm">{c.solution}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Result</p>
                    <p className="text-gray-700 text-sm font-medium">{c.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us + Stats ── */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Why Choose Us</p>
              <h2 className="section-title">Your Trusted CA Partner in {CITY}</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">We combine deep technical expertise with personalised service to deliver outcomes that truly matter.</p>
              <div className="space-y-5">
                {[
                  { title: 'ICAI Certified Professionals', desc: `All our CAs are ICAI-certified (Membership No: ${ICAI_NO}) with specializations in tax, audit, and corporate law.` },
                  { title: 'Local Expertise in ' + CITY, desc: `Deep knowledge of local business environment, Mumbai CA requirements, and Maharashtra-specific compliance.` },
                  { title: 'Timely Delivery — Always', desc: 'We meet deadlines without exception. Your compliance filings are never late.' },
                  { title: 'Transparent Pricing', desc: 'Clear fees, no hidden charges. Starting from ₹999. You know exactly what you pay for.' },
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
              <h3 className="text-xl font-bold mb-6">Our Track Record in {CITY}</h3>
              <div className="grid grid-cols-2 gap-5">
                {STATS.map(stat => (
                  <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-amber-400 mb-1">{stat.value}</p>
                    <p className="text-blue-200 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-400">★★★★★</span>
                  <span className="text-white text-sm font-semibold">4.9/5 Client Rating</span>
                </div>
                <Link to="/contact" className="block text-center bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-6 py-3 rounded-xl transition-all">
                  Talk to a CA in {CITY} Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Credentials / ICAI Trust Section ── */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'ICAI Membership', value: `No: ${ICAI_NO}`, icon: '🏛️' },
              { label: 'Practice Since', value: '2008', icon: '📅' },
              { label: 'UDIN Compliance', value: '100% Certified', icon: '✅' },
              { label: 'Code of Ethics', value: 'ICAI Adherent', icon: '⚖️' },
            ].map((item, i) => (
              <div key={i} className="bg-blue-800/50 rounded-xl p-4">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-amber-400 font-bold text-sm">{item.value}</p>
                <p className="text-blue-300 text-xs mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <a
              href="https://eservices.icai.org/icai-eres/memberSearch.html"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm transition-colors"
            >
              Verify our ICAI registration <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── CA Photo + Personal Trust Section ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* CA Photo side */}
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-4">Meet Your CA</p>
              <div className="relative mb-6">
                {/* Photo placeholder — replace src with real CA photo */}
                <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-blue-100">
                  <img
                    src="https://ui-avatars.com/api/?name=CA+Rajan+Sharma&background=1e40af&color=fff&size=256&font-size=0.3"
                    alt="CA Rajan Sharma - Founder, CA Firm Mumbai"
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = '#1e40af';
                    }}
                  />
                </div>
                {/* ICAI badge overlay */}
                <div className="absolute -bottom-3 -right-3 bg-amber-400 text-blue-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                  ICAI Reg: {ICAI_NO}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>CA Rajan Sharma</h3>
              <p className="text-blue-700 font-medium mb-2">Founder & Senior Partner · FCA</p>
              <p className="text-gray-500 text-sm text-center lg:text-left leading-relaxed max-w-sm">
                FCA with 20 years of experience in corporate taxation, statutory audits, and business advisory for SMEs across {CITY}.
              </p>
              <div className="flex gap-3 mt-4">
                <a href={PHONE_TEL}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
                  <Phone className="w-4 h-4" /> Call Directly
                </a>
                <a href="https://eservices.icai.org/icai-eres/memberSearch.html" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium px-4 py-2 rounded-xl text-sm transition-all">
                  Verify ICAI <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            {/* Message from CA */}
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 relative">
                <div className="text-6xl text-blue-200 font-serif absolute top-4 left-6 leading-none">"</div>
                <div className="pt-4">
                  <p className="text-gray-700 text-lg leading-relaxed italic mb-4">
                    I started this firm with one mission — to give every business owner and individual in {CITY} access to expert, honest financial guidance. Not just the large corporates, but every small business, every salaried employee, every startup founder.
                  </p>
                  <p className="text-gray-700 leading-relaxed italic">
                    In 20 years, what hasn't changed is our commitment: we meet every deadline, we explain everything in plain language, and we genuinely care about your financial outcome.
                  </p>
                  <div className="mt-6 pt-4 border-t border-blue-100">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">Personally handled 2,000+ client cases · Never missed a filing deadline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Client Reviews</p>
            <h2 className="section-title">What Our {CITY} Clients Say</h2>
            <p className="text-gray-400 text-sm mt-2">⭐⭐⭐⭐⭐ 4.9/5 average rating from 127+ clients</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">{t.name[0]}</div>
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

      {/* ── Google Reviews ── */}
      <GoogleReviews />

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

      {/* ── Final CTA ── */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Simplify Your Finances?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">Book a free 30-minute consultation with our {CITY} CA team today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/book-appointment"
              className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-8 py-4 rounded-xl transition-all shadow-lg flex items-center gap-2">
              Book Appointment <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={PHONE_TEL}
              className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center gap-2">
              <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
