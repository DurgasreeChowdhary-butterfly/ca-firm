const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header (standard API calls)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Check query param — needed for browser <img> and <iframe> src tags
    //    which cannot send custom headers
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // For magic-link scoped JWTs — they are not admin tokens, skip DB lookup
    if (decoded.type === 'magic') {
      req.magicUser = decoded;
      return next();
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token is no longer valid.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    next(error);
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.admin?.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Access denied. Superadmin only.' });
  }
  next();
};

module.exports = { protect, superAdminOnly };
