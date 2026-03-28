import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { getBlogs } from '../utils/api';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Fallback blogs shown when API has no data yet
const FALLBACK_BLOGS = [
  {
    _id: 'f1', slug: null,
    title: 'How to File Income Tax Returns for FY 2024-25',
    excerpt: 'A complete guide to filing your Income Tax Returns for FY 2024-25, covering eligibility, forms, and step-by-step instructions.',
    author: 'CA Rajan Sharma', tags: ['income tax', 'itr filing'],
    readTime: 5, publishedAt: new Date('2025-03-01'),
    coverImage: null,
  },
  {
    _id: 'f2', slug: null,
    title: 'GST Registration: Complete Guide for New Businesses',
    excerpt: 'Everything new businesses need to know about GST registration — eligibility, documents, process and timeline.',
    author: 'CA Priya Mehta', tags: ['gst', 'business registration'],
    readTime: 6, publishedAt: new Date('2025-02-15'),
    coverImage: null,
  },
  {
    _id: 'f3', slug: null,
    title: 'Top 10 Tax Saving Strategies for Salaried Employees in 2025',
    excerpt: 'Discover the top 10 proven tax saving strategies for salaried employees to legally minimize your income tax in 2025.',
    author: 'CA Rajan Sharma', tags: ['tax planning', 'salary'],
    readTime: 7, publishedAt: new Date('2025-01-20'),
    coverImage: null,
  },
  {
    _id: 'f4', slug: null,
    title: 'Understanding the New Tax Regime vs Old Tax Regime',
    excerpt: 'A comprehensive comparison of old and new tax regimes to help you decide which is more beneficial for your income profile.',
    author: 'CA Arjun Patel', tags: ['income tax', 'tax regime'],
    readTime: 8, publishedAt: new Date('2024-12-10'),
    coverImage: null,
  },
  {
    _id: 'f5', slug: null,
    title: 'GSTR-3B vs GSTR-1: Key Differences Every Business Should Know',
    excerpt: 'Confused between GSTR-1 and GSTR-3B? This article breaks down each return, its purpose, due dates and how they relate to each other.',
    author: 'CA Priya Mehta', tags: ['gst', 'compliance'],
    readTime: 5, publishedAt: new Date('2024-11-05'),
    coverImage: null,
  },
  {
    _id: 'f6', slug: null,
    title: 'Company Registration in India: Pvt Ltd vs LLP vs OPC',
    excerpt: 'Choosing the right business structure is crucial for your startup. Compare Private Limited, LLP, and OPC to make an informed decision.',
    author: 'CA Rajan Sharma', tags: ['company registration', 'startup'],
    readTime: 9, publishedAt: new Date('2024-10-15'),
    coverImage: null,
  },
];

const TAG_COLORS = [
  'bg-blue-50 text-blue-700', 'bg-green-50 text-green-700',
  'bg-purple-50 text-purple-700', 'bg-amber-50 text-amber-700',
];

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchBlogs = async (searchTerm = search, pg = page) => {
    setLoading(true);
    try {
      const res = await getBlogs({ page: pg, limit: 9, search: searchTerm || undefined });
      if (res.data.data && res.data.data.length > 0) {
        setBlogs(res.data.data);
        setPagination(res.data.pagination || {});
        setUsingFallback(false);
      } else {
        // API returned empty — show fallback content
        setBlogs(FALLBACK_BLOGS);
        setUsingFallback(true);
      }
    } catch {
      // API error — show fallback content
      setBlogs(FALLBACK_BLOGS);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, [page]); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (usingFallback) {
      // Filter fallback locally
      const filtered = FALLBACK_BLOGS.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        b.tags.some(t => t.includes(search.toLowerCase()))
      );
      setBlogs(filtered.length > 0 ? filtered : FALLBACK_BLOGS);
    } else {
      fetchBlogs(search, 1);
    }
  };

  return (
    <>
      <SEO
        title="Blog & Tax Insights"
        description="Expert articles on GST, Income Tax, company registration and tax planning. Stay updated with CA Firm Mumbai's knowledge hub."
        canonical="/blog"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-2">Knowledge Hub</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Blog & Tax Insights
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Expert articles on GST, Income Tax, company law and financial management — written by our CAs in plain language.
          </p>
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button type="submit" className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-semibold px-5 py-3 rounded-xl text-sm transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {usingFallback && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm text-center">
              📝 Showing sample articles. Run <code className="bg-amber-100 px-1 rounded">npm run seed</code> on the backend to load real blog posts.
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">No articles found for "{search}"</p>
              <button onClick={() => { setSearch(''); fetchBlogs('', 1); }}
                className="btn-outline">Clear Search</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <article key={blog._id} className="card hover:shadow-lg transition-all group flex flex-col">
                  {/* Cover image or gradient placeholder */}
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title}
                      className="w-full h-44 object-cover rounded-xl mb-4" loading="lazy" />
                  ) : (
                    <div className={`w-full h-44 rounded-xl mb-4 flex items-center justify-center text-4xl ${
                      ['bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-amber-50'][i % 4]
                    }`}>
                      {['📋', '🧾', '🏢', '💡', '🔍', '📊'][i % 6]}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {(blog.tags || []).slice(0, 2).map((tag, ti) => (
                      <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium ${TAG_COLORS[ti % TAG_COLORS.length]}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-blue-700 transition-colors flex-1">
                    {blog.slug ? (
                      <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                    ) : (
                      blog.title
                    )}
                  </h2>

                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{blog.excerpt}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {blog.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {blog.readTime} min read
                        </span>
                      )}
                    </div>
                    {blog.slug ? (
                      <Link to={`/blog/${blog.slug}`}
                        className="text-blue-700 text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-gray-300 text-xs">Coming soon</span>
                    )}
                  </div>

                  {blog.author && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                      <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                        {blog.author[0]}
                      </div>
                      <span className="text-xs text-gray-500">{blog.author}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {/* Pagination — only for real API data */}
          {!usingFallback && pagination.pages > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-5 py-2.5 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-gray-100 transition-colors">
                ← Previous
              </button>
              <span className="flex items-center text-sm text-gray-500">
                Page {page} of {pagination.pages}
              </span>
              <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
                className="px-5 py-2.5 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-gray-100 transition-colors">
                Next →
              </button>
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 bg-blue-900 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Have a Tax Question?
            </h3>
            <p className="text-blue-200 mb-5">Get a direct answer from our CA team — free, no obligation.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/compliance-query" className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-6 py-3 rounded-xl transition-all text-sm">
                🤖 Ask AI Tax Q&A
              </Link>
              <Link to="/book-appointment" className="border-2 border-white/30 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                📅 Book Free CA Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
