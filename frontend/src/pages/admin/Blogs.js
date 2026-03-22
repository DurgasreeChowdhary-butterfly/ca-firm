import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAdminBlogs, deleteBlog, updateBlog } from '../../utils/api';
import { Plus, Trash2, Edit, Eye, EyeOff, Search } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', isPublished: '', page: 1 });
  const [pagination, setPagination] = useState({});

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (!params.search) delete params.search;
      if (params.isPublished === '') delete params.isPublished;
      const res = await getAdminBlogs(params);
      setBlogs(res.data.data);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load blogs'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post? This cannot be undone.')) return;
    try { await deleteBlog(id); toast.success('Blog deleted'); fetchBlogs(); }
    catch { toast.error('Delete failed'); }
  };

  const togglePublish = async (blog) => {
    try {
      await updateBlog(blog._id, { ...blog, isPublished: !blog.isPublished });
      toast.success(blog.isPublished ? 'Blog unpublished' : 'Blog published!');
      fetchBlogs();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm">{pagination.total || 0} total posts</p>
        </div>
        <Link to="/admin/blogs/new" className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
            placeholder="Search posts..."
            className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filters.isPublished} onChange={e => setFilters(f => ({ ...f, isPublished: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Posts</option>
          <option value="true">Published</option>
          <option value="false">Drafts</option>
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <LoadingSpinner /> : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Title','Tags','Status','Views','Read Time','Date','Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.length === 0 ? (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400">No blog posts found. <Link to="/admin/blogs/new" className="text-blue-700 hover:underline">Create your first post</Link></td></tr>
                ) : blogs.map(blog => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-2">{blog.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">/{blog.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${blog.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{blog.views ?? 0}</td>
                    <td className="px-4 py-3 text-gray-500">{blog.readTime} min</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(blog.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => togglePublish(blog)} title={blog.isPublished ? 'Unpublish' : 'Publish'}
                          className={`p-1.5 rounded-lg transition-colors ${blog.isPublished ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-green-50 text-green-600'}`}>
                          {blog.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <Link to={`/admin/blogs/edit/${blog._id}`} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Edit className="w-3.5 h-3.5" /></Link>
                        <button onClick={() => handleDelete(blog._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
            <p className="text-gray-500">Page {pagination.page} of {pagination.pages}</p>
            <div className="flex gap-2">
              <button disabled={filters.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40">← Prev</button>
              <button disabled={filters.page === pagination.pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
