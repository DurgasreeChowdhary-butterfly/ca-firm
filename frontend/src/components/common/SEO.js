import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'CA Firm | Trusted Chartered Accountants';
const DEFAULT_DESC = 'Professional CA services including Income Tax Filing, GST, Company Registration, Audit & Tax Planning. Trusted by 500+ clients across India.';

export default function SEO({ title, description, keywords, canonical }) {
  const fullTitle = title ? `${title} | CA Firm` : SITE_NAME;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || DEFAULT_DESC} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={`https://cafirm.com${canonical}`} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || DEFAULT_DESC} />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
}
