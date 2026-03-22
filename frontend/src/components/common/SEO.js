import React from 'react';
import { Helmet } from 'react-helmet-async';

const FIRM_NAME = 'CA Firm';
const CITY = 'Mumbai';
const PHONE = '+91 98765 43210';
const ICAI = 'XXXXXX';
const SITE_URL = 'https://trusted-ca-firm.netlify.app';

const DEFAULT_TITLE = `${FIRM_NAME} | GST & Tax Consultant in ${CITY} | Chartered Accountant`;
const DEFAULT_DESC = `${FIRM_NAME} offers GST filing, ITR, Audit and Tax Advisory in ${CITY}. 15+ years experience, 500+ clients. ICAI Membership No: ${ICAI}. Call ${PHONE}.`;

export default function SEO({ title, description, keywords, canonical, schema }) {
  const fullTitle = title ? `${title} | ${FIRM_NAME} ${CITY}` : DEFAULT_TITLE;
  const fullDesc = description || DEFAULT_DESC;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDesc} />
      {keywords && <meta name="keywords" content={`${keywords}, CA ${CITY}, chartered accountant ${CITY}`} />}
      {canonical && <link rel="canonical" href={`${SITE_URL}${canonical}`} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={`${SITE_URL}${canonical}`} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDesc} />

      <meta name="robots" content="index, follow" />

      {/* Custom schema per page */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
