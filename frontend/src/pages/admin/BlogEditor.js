import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createBlog, updateBlog, getAdminBlog } from '../../utils/api';
import { Save, Eye, EyeOff, ArrowLeft, Tag, X, Loader, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const INITIAL = {
  title: '',
  content: '',
  excerpt: '',
  metaDescription: '',
  tags: [],
  coverImage: '',
  author: 'CA Firm Team',
  isPublished: false,
};

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INITIAL);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (isEdit) {
      getAdminBlog(id)
        .then(res => {
          const b = res.data.data;
          setForm({
            title: b.title || '',
            content: b.content || '',
            excerpt: b.excerpt || '',
            metaDescription: b.metaDescription || '',
            tags: b.tags || [],
            coverImage: b.coverImage || '',
            author: b.author || 'CA Firm Team',
            isPublished: b.isPublished || false,
          });
        })
        .catch(() => { toast.error('Failed to load blog'); navigate('/admin/blogs'); })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm(f => ({ ...f, [name]: val }));
    if (name === 'content') {
      const words = value.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '');
      if (tag && !form.tags.includes(tag) && form.tags.length < 8) {
        setForm(f => ({ ...f, tags: [...f.tags, tag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  const handleSave = async (publishOverride) => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.content.trim()) { toast.error('Content is required'); return; }

    setSaving(true);
    const payload = {
      ...form,
      isPublished: publishOverride !== undefined ? publishOverride : form.isPublished,
    };

    try {
      if (isEdit) {
        await updateBlog(id, payload);
        toast.success('Blog updated successfully!');
      } else {
        await createBlog(payload);
        toast.success('Blog created successfully!');
      }
      navigate('/admin/blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/admin/blogs" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Blog Post' : 'New Blog Post'}</h1>
            <p className="text-gray-400 text-xs">{wordCount} words · ~{readTime} min read</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(p => !p)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${preview ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? 'Hide Preview' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold disabled:opacity-40 transition-colors"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div className="card">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Blog post title..."
              className="w-full text-2xl font-bold text-gray-900 border-none outline-none placeholder-gray-300 resize-none bg-transparent"
              style={{ fontFamily: "'Playfair Display', serif" }}
            />
          </div>

          {/* Content */}
          <div className="card">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <label className="text-sm font-semibold text-gray-700">Content *</label>
              <span className="text-xs text-gray-400">Supports HTML tags for formatting</span>
            </div>

            {preview ? (
              <div
                className="blog-content min-h-[400px] prose max-w-none"
                dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-gray-400">Nothing to preview yet...</p>' }}
              />
            ) : (
              <>
                {/* Simple formatting toolbar */}
                <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-gray-100">
                  {[
                    { label: 'H2', html: '<h2>Heading</h2>' },
                    { label: 'H3', html: '<h3>Subheading</h3>' },
                    { label: 'B', html: '<strong>bold text</strong>', style: 'font-bold' },
                    { label: 'I', html: '<em>italic text</em>', style: 'italic' },
                    { label: 'UL', html: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>' },
                    { label: 'OL', html: '<ol>\n  <li>Step 1</li>\n  <li>Step 2</li>\n</ol>' },
                    { label: 'P', html: '<p>New paragraph</p>' },
                    { label: '---', html: '<hr />' },
                  ].map(({ label, html, style }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        const textarea = document.querySelector('textarea[name="content"]');
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newContent = form.content.substring(0, start) + html + form.content.substring(end);
                        setForm(f => ({ ...f, content: newContent }));
                        const words = newContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
                        setWordCount(words);
                      }}
                      className={`px-2.5 py-1 text-xs rounded border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors ${style || ''}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write your blog content here... You can use HTML tags like <h2>, <p>, <ul>, <li>, <strong>, <em> for formatting."
                  rows={20}
                  className="w-full border-none outline-none text-gray-700 text-sm leading-relaxed resize-y font-mono bg-transparent placeholder-gray-300"
                />
              </>
            )}
          </div>

          {/* Excerpt */}
          <div className="card">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
            <p className="text-xs text-gray-400 mb-2">Short summary shown on blog listing page (auto-generated if left blank)</p>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={3}
              maxLength={300}
              placeholder="Brief description of this post (max 300 chars)..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.excerpt.length}/300</p>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Publish status */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Publish Settings</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-colors ${form.isPublished ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm text-gray-700">
                {form.isPublished ? <span className="text-green-600 font-medium">Published</span> : <span className="text-gray-500">Draft</span>}
              </span>
            </label>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <button onClick={() => handleSave(false)} disabled={saving} className="w-full border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                Save as Draft
              </button>
              <button onClick={() => handleSave(true)} disabled={saving} className="w-full bg-blue-700 hover:bg-blue-800 rounded-lg py-2 text-sm font-semibold text-white disabled:opacity-40 transition-colors">
                {saving ? 'Saving...' : 'Publish Now'}
              </button>
            </div>
          </div>

          {/* Author */}
          <div className="card">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="CA Firm Team"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tags */}
          <div className="card">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags
            </label>
            <p className="text-xs text-gray-400 mb-2">Press Enter or comma to add (max 8)</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-blue-900 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="e.g. income tax, gst..."
              disabled={form.tags.length >= 8}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>

          {/* Cover Image */}
          <div className="card">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Image className="w-3.5 h-3.5" /> Cover Image URL
            </label>
            <input
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.coverImage && (
              <img src={form.coverImage} alt="cover preview" className="w-full aspect-video object-cover rounded-lg mt-2 border border-gray-200" onError={e => e.target.style.display='none'} />
            )}
          </div>

          {/* SEO */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">SEO Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  maxLength={160}
                  placeholder="Describe this post for search engines (max 160 chars)..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">{form.metaDescription.length}/160 chars</p>
                  <span className={`text-xs ${form.metaDescription.length > 150 ? 'text-red-500' : form.metaDescription.length > 120 ? 'text-amber-500' : 'text-green-500'}`}>
                    {form.metaDescription.length > 150 ? '⚠️ Too long' : form.metaDescription.length > 120 ? '👍 Good' : form.metaDescription.length > 0 ? '✅ Great' : ''}
                  </span>
                </div>
              </div>
              {/* SEO Preview */}
              {(form.title || form.metaDescription) && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Google Preview:</p>
                  <p className="text-blue-700 text-sm font-medium leading-tight line-clamp-1">{form.title || 'Post Title'}</p>
                  <p className="text-green-700 text-xs">cafirm.com/blog/{form.title ? form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'slug'}</p>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{form.metaDescription || form.excerpt || 'Meta description will appear here...'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
