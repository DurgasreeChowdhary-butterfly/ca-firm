require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Blog = require('../models/Blog');

const blogPosts = [
  {
    title: 'How to File Income Tax Returns for FY 2024-25',
    content: '<h2>Introduction</h2><p>Filing income tax returns is a critical obligation for every taxpayer in India. In this comprehensive guide, we walk you through the entire process step by step.</p><h2>Who Must File ITR?</h2><p>Any individual whose gross total income exceeds the basic exemption limit must file an ITR. For FY 2024-25, this is ₹2.5 lakh for individuals below 60 years.</p><h2>Steps to File ITR Online</h2><p>Visit the Income Tax e-filing portal, login with your PAN and password, select the appropriate ITR form, fill in your income details, claim deductions, then verify and submit.</p><p>Filing on time avoids penalties and helps maintain a clean financial record.</p>',
    excerpt: 'A complete guide to filing your Income Tax Returns for FY 2024-25, covering eligibility, forms, and step-by-step instructions.',
    metaDescription: 'Learn how to file income tax returns for FY 2024-25. Step-by-step guide for salaried, self-employed and business owners.',
    tags: ['income tax', 'itr filing', 'tax compliance'],
    author: 'CA Rajesh Kumar',
    isPublished: true,
  },
  {
    title: 'GST Registration: Complete Guide for New Businesses',
    content: '<h2>What is GST?</h2><p>The Goods and Services Tax (GST) is a comprehensive indirect tax levied on the supply of goods and services across India.</p><h2>When is GST Registration Mandatory?</h2><p>GST registration is mandatory when your aggregate annual turnover exceeds ₹40 lakhs for goods, or ₹20 lakhs for services.</p><h2>Documents Required</h2><ul><li>PAN Card</li><li>Aadhaar Card</li><li>Business Registration Certificate</li><li>Bank Statement</li><li>Address Proof of Business</li></ul><h2>Process</h2><p>The registration process is entirely online through the GST portal and takes 3-7 working days after document verification.</p>',
    excerpt: 'Everything new businesses need to know about GST registration — eligibility, documents, process and timeline.',
    metaDescription: 'Complete guide to GST registration for new businesses in India. Learn eligibility, required documents, and step-by-step registration process.',
    tags: ['gst', 'business registration', 'startup'],
    author: 'CA Priya Sharma',
    isPublished: true,
  },
  {
    title: 'Top 10 Tax Saving Strategies for Salaried Employees in 2025',
    content: '<h2>Introduction</h2><p>Smart tax planning can significantly reduce your tax outgo. Here are the most effective strategies for salaried employees.</p><h2>1. Maximize Section 80C</h2><p>Invest up to ₹1.5 lakh in PPF, ELSS, NSC, or tax-saving FDs to claim deduction under Section 80C.</p><h2>2. Health Insurance Premium (80D)</h2><p>Premiums paid for health insurance qualify for deduction up to ₹25,000 (₹50,000 for senior citizens).</p><h2>3. Home Loan Benefits</h2><p>Interest on home loan up to ₹2 lakh is deductible under Section 24(b).</p><h2>4. NPS Contribution</h2><p>Additional ₹50,000 deduction under Section 80CCD(1B) for NPS contributions, over and above 80C limit.</p>',
    excerpt: 'Discover the top 10 proven tax saving strategies for salaried employees to legally minimize your income tax in 2025.',
    metaDescription: 'Top 10 tax saving strategies for salaried employees in 2025. Legal ways to reduce your income tax using deductions and exemptions.',
    tags: ['tax planning', 'tax saving', 'salary', '80c'],
    author: 'CA Rajesh Kumar',
    isPublished: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ca_firm_db');
    console.log('✅ Connected to MongoDB');

    // Create admin
    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@cafirm.com' });
    if (!existing) {
      await Admin.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@cafirm.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'superadmin',
      });
      console.log('✅ Admin created:', process.env.ADMIN_EMAIL || 'admin@cafirm.com');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // Seed sample blog posts
    // IMPORTANT: Use new Blog().save() — NOT insertMany() — so the pre('save')
    // middleware fires and auto-generates the slug field for each post.
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      for (const data of blogPosts) {
        const blog = new Blog(data);
        await blog.save(); // triggers slug generation
        console.log(`✅ Blog created: "${blog.title.substring(0, 45)}..." → slug: ${blog.slug}`);
      }
    } else {
      // Fix any existing blogs that are missing slugs
      const missing = await Blog.find({ slug: { $exists: false } });
      if (missing.length > 0) {
        console.log(`🔧 Fixing ${missing.length} blogs missing slugs...`);
        for (const blog of missing) {
          blog.title = blog.title; // mark modified so pre-save fires
          await blog.save();
          console.log(`  Fixed: "${blog.title.substring(0, 40)}" → slug: ${blog.slug}`);
        }
      } else {
        console.log(`ℹ️  ${blogCount} blog posts already exist`);
      }
    }

    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────────────');
    console.log('Admin Email   :', process.env.ADMIN_EMAIL || 'admin@cafirm.com');
    console.log('Admin Password:', process.env.ADMIN_PASSWORD || 'Admin@123456');
    console.log('─────────────────────────────────────');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
