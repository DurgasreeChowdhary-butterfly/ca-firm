import React from 'react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';

const FIRM = 'CA Firm';
const CITY = 'Mumbai';
const EMAIL = 'info@cafirm.com';
const PHONE = '+91 98765 43210';
const DATE = 'March 2026';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO title="Privacy Policy" description={`Privacy policy of ${FIRM}, ${CITY}. How we collect, use, and protect your personal information.`} canonical="/privacy-policy" />
      <section className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-blue-300 text-sm mb-2">Legal</p>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Privacy Policy</h1>
          <p className="text-blue-200 text-sm">Last updated: {DATE}</p>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 prose prose-blue max-w-none">
          <div className="space-y-8 text-gray-700 leading-relaxed">

            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-600">
              <p className="text-blue-900 font-medium">This Privacy Policy describes how {FIRM} ("we", "our", or "us"), a Chartered Accountancy firm based in {CITY}, India, collects, uses, and protects information provided through our website and services.</p>
            </div>

            {[
              {
                title: '1. Information We Collect',
                content: [
                  'Personal identification: Name, email address, phone number, PAN, GSTIN, Aadhaar (where required for services)',
                  'Financial information: Income details, tax documents, bank statements, GST invoices — collected only as required to provide CA services',
                  'Contact information: Submitted through our contact forms, appointment booking, or compliance query tool',
                  'Usage data: Browser type, pages visited, time spent — collected anonymously via analytics',
                ]
              },
              {
                title: '2. How We Use Your Information',
                content: [
                  'To provide CA services including tax filing, GST compliance, audit, and financial advisory',
                  'To respond to your queries and appointment requests',
                  'To send compliance deadline reminders and tax update newsletters (only if you opt in)',
                  'To improve our website and service quality',
                  'To comply with legal obligations under Indian law including the Income Tax Act and GST Act',
                ]
              },
              {
                title: '3. Data Security',
                content: [
                  'All documents uploaded through our portal are stored securely and accessible only to our authorised CA team',
                  'We use industry-standard encryption (HTTPS/SSL) for all data transmission',
                  'Financial documents are handled in accordance with the ICAI Code of Ethics and professional confidentiality standards',
                  'We do not sell, trade, or rent your personal information to third parties',
                  'Access to sensitive client data is restricted to the CA handling your account',
                ]
              },
              {
                title: '4. Data Retention',
                content: [
                  'Tax records and financial documents are retained for a minimum of 8 years as required by Indian tax law',
                  'Contact form submissions are retained for 2 years',
                  'You may request deletion of non-statutory data at any time by emailing us',
                ]
              },
              {
                title: '5. Your Rights',
                content: [
                  'Access: Request a copy of the personal data we hold about you',
                  'Correction: Request correction of inaccurate data',
                  'Deletion: Request deletion of data not required by law',
                  'Objection: Object to processing of your data for marketing purposes',
                  'To exercise these rights, email us at ' + EMAIL,
                ]
              },
              {
                title: '6. Cookies',
                content: [
                  'Our website uses essential cookies only for session management and security',
                  'We do not use advertising or tracking cookies',
                  'You can disable cookies in your browser settings without affecting core site functionality',
                ]
              },
              {
                title: '7. Third-Party Services',
                content: [
                  'Google Maps embed on our Contact page (governed by Google Privacy Policy)',
                  'Razorpay payment gateway for fee collection (governed by Razorpay Privacy Policy)',
                  'We do not share your data with these services beyond what is necessary for functionality',
                ]
              },
              {
                title: '8. Contact Us',
                content: [
                  `For any privacy-related questions or requests, contact: ${EMAIL}`,
                  `Phone: ${PHONE}`,
                  `Address: ${FIRM}, 123 Financial District, BKC, ${CITY} – 400051`,
                ]
              },
            ].map(({ title, content }) => (
              <div key={title}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
                <ul className="space-y-2">
                  {content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="border-t pt-6 flex gap-4">
              <Link to="/terms" className="text-blue-600 hover:underline text-sm">Terms of Service</Link>
              <Link to="/disclaimer" className="text-blue-600 hover:underline text-sm">Disclaimer</Link>
              <Link to="/contact" className="text-blue-600 hover:underline text-sm">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
