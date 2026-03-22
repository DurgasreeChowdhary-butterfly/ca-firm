import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getBlogBySlug } from '../utils/api';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LeadForm from '../components/common/LeadForm';
import toast from 'react-hot-toast';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getBlogBySlug(slug)
      .then(res => setBlog(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (notFound) return <Navigate to="/blog" replace />;

  return (
    <>
      <Helmet>
        <title>{blog.title} | CA Firm Blog</title>
        <meta name="description" content={blog.metaDescription || blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.metaDescription || blog.excerpt} />
      </Helmet>

      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-1 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex gap-2 flex-wrap mb-4">
            {blog.tags?.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-xs bg-blue-700/50 text-blue-200 px-3 py-1 rounded-full">
                <Tag className="w-2.5 h-2.5" />{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-blue-200 text-sm">
            <span>By <strong className="text-white">{blog.author}</strong></span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{blog.readTime} min read</span>
            <button onClick={handleShare} className="flex items-center gap-1 hover:text-white transition-colors ml-auto">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <article className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
                {blog.coverImage && (
                  <img src={blog.coverImage} alt={blog.title} className="w-full rounded-xl mb-8 aspect-video object-cover" />
                )}
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {blog.tags?.map(tag => (
                  <Link key={tag} to={`/blog?tag=${tag}`} className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="card border-t-4 border-t-blue-700">
                <h3 className="font-bold text-gray-900 mb-4">Get Expert Help</h3>
                <p className="text-gray-500 text-sm mb-4">Have questions about this topic? Talk to one of our expert CAs for free.</p>
                <LeadForm compact />
              </div>
              <div className="card bg-amber-50 border border-amber-100">
                <p className="font-semibold text-gray-900 mb-2 text-sm">📅 Book a Consultation</p>
                <p className="text-gray-500 text-xs mb-3">30 minutes, completely free. Get personalized advice from a certified CA.</p>
                <Link to="/book-appointment" className="block text-center bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                  Book Now
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
