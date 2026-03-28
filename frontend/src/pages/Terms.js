import React from 'react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';

const FIRM = 'CA Firm';
const CITY = 'Mumbai';
const EMAIL = 'info@cafirm.com';
const DATE = 'March 2026';

export default function Terms() {
  return (
    <>
      <SEO title="Terms of Service" description={`Terms and conditions for using ${FIRM}'s website and CA services.`} canonical="/terms" />
      <section className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-blue-300 text-sm mb-2">Legal</p>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Terms of Service</h1>
          <p className="text-blue-200 text-sm">Last updated: {DATE}</p>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8 text-gray-700 leading-relaxed">

            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-600">
              <p className="text-blue-900 font-medium">By accessing this website or engaging our services, you agree to the following terms. Please read them carefully. These terms are governed by the laws of India and the jurisdiction of {CITY} courts.</p>
            </div>

            {[
              {
                title: '1. Services',
                items: [
                  `${FIRM} provides professional Chartered Accountancy services including income tax filing, GST compliance, company registration, audit, and financial advisory`,
                  'Services are rendered by ICAI-registered Chartered Accountants in accordance with ICAI standards',
                  'Engagement terms, fees, and scope are defined in a separate engagement letter for each client',
                  'We reserve the right to decline any engagement at our discretion',
                ]
              },
              {
                title: '2. Website Use',
                items: [
                  'This website is for informational purposes only and does not constitute professional advice',
                  'Information on this website is believed to be accurate but may not reflect the latest legal developments',
                  'You may not use this website for any unlawful purpose or in a way that infringes others\' rights',
                  'Automated scraping, data extraction, or bot access is prohibited',
                ]
              },
              {
                title: '3. AI Compliance Query Tool',
                items: [
                  'The AI Tax Q&A tool provides general guidance based on publicly available tax laws and CBIC/Income Tax Act sources',
                  'AI-generated answers are for informational purposes only and do NOT constitute professional tax advice',
                  'Always consult a qualified CA before making tax or business decisions',
                  'We are not liable for any decisions made based on AI tool responses',
                ]
              },
              {
                title: '4. Document Upload',
                items: [
                  'Documents uploaded through our portal are for CA review purposes only',
                  'You confirm you have the right to share any documents you upload',
                  'We maintain confidentiality per ICAI Code of Ethics',
                  'Do not upload documents containing passwords, OTPs, or security credentials',
                ]
              },
              {
                title: '5. Fees & Payments',
                items: [
                  'Professional fees are agreed upon before commencement of work',
                  'Fees are non-refundable once work has commenced unless mutually agreed',
                  'Government fees, filing fees, and out-of-pocket expenses are charged at actuals',
                  'Payment is accepted via Razorpay, UPI, NEFT/RTGS, or cheque',
                ]
              },
              {
                title: '6. Limitation of Liability',
                items: [
                  `${FIRM}'s liability is limited to the professional fees paid for the specific service`,
                  'We are not liable for penalties or interest arising from client-provided incorrect information',
                  'We are not liable for government system failures, portal downtime, or force majeure events',
                  'Our liability for any indirect, consequential, or special damages is expressly excluded',
                ]
              },
              {
                title: '7. Intellectual Property',
                items: [
                  'All website content, logos, and materials are owned by ' + FIRM,
                  'You may not reproduce or redistribute our content without written permission',
                  'Client documents remain the property of the client at all times',
                ]
              },
              {
                title: '8. Governing Law',
                items: [
                  `These terms are governed by the laws of India`,
                  `Any disputes shall be subject to the exclusive jurisdiction of courts in ${CITY}, Maharashtra`,
                  'Any disputes shall first be attempted to be resolved through mutual discussion',
                  'Contact: ' + EMAIL,
                ]
              },
            ].map(({ title, items }) => (
              <div key={title}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="border-t pt-6 flex gap-4">
              <Link to="/privacy-policy" className="text-blue-600 hover:underline text-sm">Privacy Policy</Link>
              <Link to="/disclaimer" className="text-blue-600 hover:underline text-sm">Disclaimer</Link>
              <Link to="/contact" className="text-blue-600 hover:underline text-sm">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
