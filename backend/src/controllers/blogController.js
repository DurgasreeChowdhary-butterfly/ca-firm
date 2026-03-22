const Blog = require('../models/Blog');

/**
 * GET /api/blogs
 * Get published blogs (public)
 */
const getBlogs = async (req, res, next) => {
  try {
    const { tag, page = 1, limit = 10, search } = req.query;
    const filter = { isPublished: true };

    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .select('title slug excerpt tags author coverImage publishedAt readTime views')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: blogs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/blogs/:slug
 * Get single blog by slug (public)
 */
const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Increment views (non-blocking)
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/blogs
 * Get all blogs including drafts (admin)
 */
const getAdminBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, isPublished } = req.query;
    const filter = {};

    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    if (search) filter.title = { $regex: search, $options: 'i' };

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .select('title slug tags isPublished publishedAt views readTime createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: blogs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/blogs
 * Create blog (admin)
 */
const createBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, metaDescription, tags, coverImage, author, isPublished } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const blog = await Blog.create({
      title, content, excerpt, metaDescription,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      coverImage, author,
      isPublished: !!isPublished,
    });

    res.status(201).json({ success: true, message: 'Blog created', data: blog });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/blogs/:id
 * Update blog (admin)
 */
const updateBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, metaDescription, tags, coverImage, author, isPublished } = req.body;

    const updateData = {
      content, excerpt, metaDescription, coverImage, author,
      isPublished: !!isPublished,
    };
    if (title) updateData.title = title;
    if (tags) updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({ success: true, message: 'Blog updated', data: blog });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/blogs/:id
 */
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/blogs/:id
 */
const getAdminBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBlogs, getBlog, getAdminBlogs, getAdminBlog, createBlog, updateBlog, deleteBlog };
