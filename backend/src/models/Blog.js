const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  coverImage: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'CA Firm Team',
    trim: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  views: {
    type: Number,
    default: 0,
  },
  readTime: {
    type: Number, // in minutes
    default: 1,
  },
}, { timestamps: true });

// Auto-generate slug from title
blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  // Auto-calculate read time (avg 200 words/min)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  // Auto-generate excerpt from content if not provided
  if (this.isModified('content') && !this.excerpt) {
    const plain = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plain.substring(0, 280) + (plain.length > 280 ? '...' : '');
  }
  next();
});

// Note: slug index is auto-created by unique:true above — no duplicate needed
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });

module.exports = mongoose.model('Blog', blogSchema);
