import React from 'react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';

const FIRM = 'CA Firm';
const DATE = 'March 2026';

export default function Disclaimer() {
  return (
    <>
      <SEO title="Disclaimer" description={`Legal disclaimer for ${FIRM}'s website and AI tax tools.`} canonical="/disclaimer" />
      <section className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-blue-300 text-sm mb-2">Legal</p>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Disclaimer</h1>
          <p className="text-blue-200 text-sm">Last updated: {DATE}</p>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6 text-gray-700 leading-relaxed">

            <div className="bg-amber-50 rounded-xl p-5 border-l-4 border-amber-500">
              <p className="text-amber-900 font-semibold mb-1">⚠️ Important Notice</p>
              <p className="text-amber-800">The information on this website, including AI-generated tax guidance, is for general informational purposes only. It does not constitute professional tax, legal, or financial advice.</p>
            </div>

            {[
              {
                title: 'General Information Disclaimer',
                text: 'While we strive to provide accurate and up-to-date information on tax laws, GST regulations, and financial matters, tax laws change frequently. Information on this website may not reflect recent amendments, notifications, or circulars issued by CBIC, the Income Tax Department, or MCA. Always verify critical information with a qualified professional.'
              },
              {
                title: 'AI Tax Q&A Tool Disclaimer',
                text: 'The AI Compliance Query tool provides responses based on publicly available Indian tax laws and official sources. These responses are automated and general in nature. They do not account for your specific circumstances, financial situation, or recent legal changes. Do NOT make tax, GST, or business decisions solely based on AI tool responses. Always consult a qualified Chartered Accountant for personalised advice.'
              },
              {
                title: 'Professional Relationship',
                text: `Using this website or submitting a query does not establish a professional CA-client relationship. A formal CA-client engagement is established only through a signed engagement letter. ${FIRM} is not responsible for actions taken based on information on this website without a formal engagement.`
              },
              {
                title: 'External Links',
                text: 'Our website may contain links to external sites including ICAI, CBIC, Income Tax India, and Razorpay. We are not responsible for the content, accuracy, or privacy practices of these external sites. Links are provided for convenience only.'
              },
              {
                title: 'No Guarantee of Results',
                text: 'Past results achieved for clients do not guarantee similar outcomes for others. Tax savings, compliance outcomes, and financial results depend on individual circumstances, applicable law at the time of filing, and government processing.'
              },
              {
                title: 'ICAI Compliance',
                text: `${FIRM} operates in compliance with the ICAI Code of Ethics. This website does not solicit clients in any manner prohibited by ICAI guidelines. All information is provided in the spirit of public education and awareness.`
              },
            ].map(({ title, text }) => (
              <div key={title}>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                <p>{text}</p>
              </div>
            ))}

            <div className="border-t pt-6 flex gap-4">
              <Link to="/privacy-policy" className="text-blue-600 hover:underline text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-blue-600 hover:underline text-sm">Terms of Service</Link>
              <Link to="/contact" className="text-blue-600 hover:underline text-sm">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
