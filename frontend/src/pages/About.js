import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { STATS, TEAM } from '../data';
import { Award, CheckCircle, ArrowRight, ExternalLink, Phone } from 'lucide-react';

const CITY = 'Mumbai';
const PHONE_TEL = 'tel:+919876543210';
const PHONE_DISPLAY = '+91 98765 43210';
const ICAI_NO = 'XXXXXX';

const values = [
  { title: 'Integrity', icon: '🤝', desc: 'We uphold the highest ethical standards in every engagement, in line with ICAI Code of Ethics.' },
  { title: 'Expertise', icon: '🎓', desc: 'ICAI-certified professionals continuously updating knowledge in a rapidly changing regulatory environment.' },
  { title: 'Client-First', icon: '💼', desc: 'Your success is our success. We tailor every solution to your unique situation.' },
  { title: 'Accuracy', icon: '🎯', desc: 'Zero-error compliance is our standard. We triple-check every filing, every computation, every document.' },
];

const credentials = [
  { label: 'ICAI Membership No', value: ICAI_NO, link: 'https://www.icai.org/post/know-your-ca' },
  { label: 'Designation', value: 'FCA (Fellow Chartered Accountant)', link: null },
  { label: 'Practice Since', value: '2008 (15+ Years)', link: null },
  { label: 'UDIN Status', value: 'All certificates issued with UDIN', link: null },
  { label: 'Additional Cert', value: 'DISA (Information Systems Audit)', link: null },
  { label: 'Code of Ethics', value: 'ICAI Adherent', link: null },
];

export default function About() {
  return (
    <>
      <SEO
        title="About Our CA Firm"
        description={`Learn about our CA firm in ${CITY} — 15+ years of experience, ICAI membership No ${ICAI_NO}, FCA-certified professionals and 500+ satisfied clients.`}
        keywords={`CA firm ${CITY}, chartered accountant ${CITY}, ICAI registered CA ${CITY}`}
        canonical="/about"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-3">About Our Firm</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Trusted CA Partner in {CITY} Since 2008
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-4">
              Founded with a mission to make quality CA services accessible — from individual taxpayers to growing businesses in {CITY}.
            </p>
            <a href={PHONE_TEL} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-lg transition-colors">
              <Phone className="w-5 h-5" /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-blue-700 mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story + Values */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Our Story</p>
              <h2 className="section-title">From a Small Practice to {CITY}'s Trusted Name</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>In 2008, our founding CA started this firm with a simple belief: every business owner and individual in {CITY} deserves access to expert financial guidance — not just the wealthy.</p>
                <p>Over 15 years, we've helped thousands of clients navigate India's complex tax landscape — from the introduction of GST in 2017 to the digital transformation of income tax filing.</p>
                <p>Today, our team of qualified professionals handles everything from basic ITR filing to complex corporate restructuring, with the same dedication to accuracy and client service that defined our early days.</p>
              </div>
              <div className="mt-6 space-y-2">
                {[
                  `ICAI-registered firm · Membership No: ${ICAI_NO}`,
                  'FCA (Fellow Chartered Accountant) designation',
                  'DISA certified — Information Systems Audit',
                  'All certificates issued with UDIN for authenticity',
                  'ICAI Code of Ethics adherent — no compromises',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map(v => (
                <div key={v.title} className="card">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Credentials Section — audit said this is missing ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Qualifications & Compliance</p>
            <h2 className="section-title">Our Credentials</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Fully verified, ICAI-registered. Clients can independently verify our credentials on the ICAI portal.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="card border-t-4 border-t-blue-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {credentials.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Award className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{c.label}</p>
                      <p className="text-gray-900 font-semibold text-sm">{c.value}</p>
                      {c.link && (
                        <a href={c.link} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 text-xs hover:underline mt-0.5">
                          Verify on ICAI <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800 font-medium">
                  🔒 All our audit certificates and reports carry a UDIN (Unique Document Identification Number) issued by ICAI, ensuring authenticity and preventing forgery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Our Team</p>
            <h2 className="section-title">Meet the Experts</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">ICAI-certified chartered accountants with decades of combined experience across taxation, audit, and corporate finance in {CITY}.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="card text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-100 shadow-md">
                  <img
                    src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1e40af&color=fff&size=200`}
                    alt={`${member.name} - CA ${member.role}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  <Award className="w-3 h-3" /> {member.experience}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-blue-700 text-sm font-medium mb-1">{member.role}</p>
                <p className="text-gray-400 text-xs mb-3">{member.specialization}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Work With {CITY}'s Trusted CA Firm?</h2>
          <p className="text-blue-200 mb-6">Schedule a free consultation — no obligation, no pressure.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/book-appointment"
              className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2">
              Book Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={PHONE_TEL}
              className="border-2 border-white/30 hover:border-white text-white font-semibold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2">
              <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
