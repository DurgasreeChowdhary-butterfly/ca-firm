import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import LeadForm from '../../components/common/LeadForm';
import { SERVICES } from '../../data';
import { CheckCircle, ArrowRight, ArrowLeft, Phone } from 'lucide-react';

export default function ServiceDetail() {
  const { id } = useParams();
  const service = SERVICES.find(s => s.id === id);
  if (!service) return <Navigate to="/services" replace />;

  const others = SERVICES.filter(s => s.id !== id).slice(0, 3);

  return (
    <>
      <SEO
        title={service.title}
        description={`${service.shortDesc} — Expert CA services. ${service.price}. Book a free consultation today.`}
        canonical={`/services/${service.id}`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center gap-1 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="text-7xl">{service.icon}</div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{service.title}</h1>
              <p className="text-blue-100 text-lg mb-3">{service.shortDesc}</p>
              <span className="bg-amber-400 text-blue-900 font-bold px-4 py-1.5 rounded-full text-sm">{service.price}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Service</h2>
                <p className="text-gray-600 leading-relaxed text-base">{service.description}</p>
              </div>

              {/* Features */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-5">What's Included</h2>
                <div className="space-y-3">
                  {service.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-5">Our Process</h2>
                <div className="space-y-4">
                  {['Initial Consultation & Document Collection', 'Analysis & Strategy Preparation', 'Execution & Filing / Registration', 'Review & Delivery of Reports', 'Ongoing Support & Compliance Monitoring'].map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-800 font-medium text-sm">{step}</p>
                        {i < 4 && <div className="w-0.5 h-4 bg-gray-200 ml-0 mt-2" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card border-t-4 border-t-blue-700">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Request a Callback</h3>
                <p className="text-gray-500 text-sm mb-5">Fill the form and our CA will call you back within 2 hours.</p>
                <LeadForm defaultService={service.title} compact />
              </div>

              <div className="card bg-blue-900 text-white">
                <p className="font-semibold mb-2">Prefer to call directly?</p>
                <a href="tel:+919876543210" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="font-bold">+91 98765 43210</span>
                </a>
                <p className="text-blue-300 text-xs mt-2">Mon–Sat: 9am – 7pm</p>
              </div>
            </div>
          </div>

          {/* Other Services */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Explore Other Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {others.map(s => (
                <Link key={s.id} to={`/services/${s.id}`} className="card group hover:border-l-4 hover:border-l-blue-700">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-700 mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{s.shortDesc}</p>
                  <span className="text-blue-700 text-xs font-medium flex items-center gap-1">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
