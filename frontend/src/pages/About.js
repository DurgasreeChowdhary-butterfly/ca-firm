import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { STATS, TEAM } from '../data';
import { Award, CheckCircle, ArrowRight } from 'lucide-react';

const values = [
  { title: 'Integrity', icon: '🤝', desc: 'We uphold the highest ethical standards in every engagement, ensuring your financial matters are handled with complete honesty.' },
  { title: 'Expertise', icon: '🎓', desc: 'Our ICAI-certified professionals continuously update their knowledge to provide cutting-edge advice in a rapidly changing regulatory environment.' },
  { title: 'Client-First', icon: '💼', desc: 'Your success is our success. We tailor every solution to your unique situation, not a generic template.' },
  { title: 'Accuracy', icon: '🎯', desc: 'Zero-error compliance is our standard. We triple-check every filing, every computation, every document.' },
];

export default function About() {
  return (
    <>
      <SEO title="About Us" description="Learn about our CA firm — 15+ years of experience, ICAI-certified professionals, and 500+ satisfied clients across India." canonical="/about" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-3">About Our Firm</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Trusted Financial Partner Since 2008
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Founded with a mission to make quality CA services accessible to every Indian — from individual taxpayers to growing businesses — we've grown into a full-service chartered accountancy firm trusted by over 500 clients.
            </p>
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

      {/* Story */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Our Story</p>
              <h2 className="section-title">From a Small Practice to a Trusted Name</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>In 2008, CA Rajan Sharma started this firm with a simple belief: every business owner and individual deserves access to expert financial guidance — not just the wealthy.</p>
                <p>Over 15 years, we've helped thousands of clients navigate India's complex tax landscape, from the introduction of GST in 2017 to the digital transformation of income tax filing.</p>
                <p>Today, our team of 12 qualified professionals handles everything from basic ITR filing to complex corporate restructuring, always with the same dedication to accuracy and client service that defined our early days.</p>
              </div>
              <div className="mt-6 space-y-2">
                {['ICAI-registered firm with FRN', 'ISO 9001:2015 certified processes', 'Member of the Institute of Chartered Accountants of India', 'Empanelled with major banks and PSUs'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
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

      {/* Team */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Our Team</p>
            <h2 className="section-title">Meet the Experts</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our team of ICAI-certified chartered accountants brings decades of combined experience across taxation, audit, and corporate finance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="card text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.name.split(' ')[1][0]}
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
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Work With Us?</h2>
          <p className="text-blue-200 mb-6">Schedule a free consultation and let's discuss how we can help your financial journey.</p>
          <Link to="/book-appointment" className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-8 py-3 rounded-xl transition-all inline-flex items-center gap-2">
            Book Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
