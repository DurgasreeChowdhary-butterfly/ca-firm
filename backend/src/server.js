require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const appointmentRoutes = require('./routes/appointments');
const blogRoutes = require('./routes/blogs');
const adminRoutes = require('./routes/admin');
const featuresRoutes = require('./routes/features');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Root route — friendly response when browser visits localhost:5000
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>CA Firm API</title>
      <style>body{font-family:system-ui,sans-serif;max-width:600px;margin:60px auto;padding:0 20px;color:#1f2937}
      h1{color:#1e40af}code{background:#f3f4f6;padding:2px 8px;border-radius:4px;font-size:14px}
      a{color:#1e40af}ul{line-height:2}</style></head>
      <body>
        <h1>✅ CA Firm API is running</h1>
        <p>Backend server is working correctly. The frontend runs separately at <a href="http://localhost:3000">localhost:3000</a></p>
        <h3>Available endpoints:</h3>
        <ul>
          <li><code>GET /api</code> — API documentation</li>
          <li><code>GET /health</code> — Health check</li>
          <li><code>POST /api/leads</code> — Submit enquiry</li>
          <li><code>GET /api/blogs</code> — Blog posts</li>
          <li><code>POST /api/auth/login</code> — Admin login</li>
        </ul>
        <p>👉 Visit <a href="http://localhost:3000">http://localhost:3000</a> for the website</p>
        <p>👉 Visit <a href="http://localhost:3000/admin/login">http://localhost:3000/admin/login</a> for admin panel</p>
      </body>
    </html>
  `);
});

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api', (req, res) => {
  res.json({
    name: 'CA Firm API', version: '1.0.0',
    endpoints: {
      auth: ['POST /api/auth/login', 'GET /api/auth/me', 'PUT /api/auth/change-password'],
      public: ['POST /api/leads', 'GET /api/appointments/slots?date=YYYY-MM-DD', 'POST /api/appointments', 'GET /api/blogs', 'GET /api/blogs/:slug'],
      admin: ['GET /api/admin/stats', 'GET|PUT|DELETE /api/admin/leads/:id', 'GET|PUT|DELETE /api/admin/appointments/:id', 'GET|POST|PUT|DELETE /api/admin/blogs/:id'],
    }
  });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\nCA Firm API running on http://localhost:${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
