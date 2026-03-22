import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { getBlogs } from '../utils/api';
import { Calendar, Clock, Tag, ArrowRight, Search } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await getBlogs({ page, limit: 9, search: search || undefined });
      setBlogs(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  return (
    <>
      <SEO title="Blog & Insights" description="Tax tips, GST updates, financial planning advice and CA insights — stay updated with our expert blog." canonical="/blog" />

      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-2">Knowledge Hub</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Blog & Insights</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">Expert articles on tax planning, GST updates, company law and financial management.</p>
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button type="submit" className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-5 py-3 rounded-xl transition-all">Search</button>
          </form>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <LoadingSpinner /> : blogs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-lg font-medium">No articles found</p>
              <p className="text-sm mt-2">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.filter(blog => blog.slug).map((blog) => (
                <Link key={blog._id} to={`/blog/${blog.slug}`} className="card group hover:shadow-xl flex flex-col">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-4 flex items-center justify-center text-5xl overflow-hidden">
                    {blog.coverImage ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" /> : '📄'}
                  </div>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {blog.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-blue-700 transition-colors line-clamp-2 flex-1">
                    {blog.title}
                  </h2>
                  {blog.excerpt && <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{blog.excerpt}</p>}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min read</span>
                    <span className="ml-auto text-blue-700 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">Read <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors">← Prev</button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-blue-700 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>{i + 1}</button>
              ))}
              <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors">Next →</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
