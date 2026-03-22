const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getLeads, getLead, updateLead, deleteLead, getLeadStats } = require('../controllers/leadController');
const { getAppointments, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { getAdminBlogs, getAdminBlog, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');

// All admin routes require auth
router.use(protect);

// Dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const Lead = require('../models/Lead');
    const Appointment = require('../models/Appointment');
    const Blog = require('../models/Blog');
    const today = new Date(); today.setHours(0,0,0,0);
    const [totalLeads, newLeads, totalAppts, pendingAppts, totalBlogs, publishedBlogs] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Blog.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
    ]);
    res.json({ success: true, data: { totalLeads, newLeads, totalAppts, pendingAppts, totalBlogs, publishedBlogs } });
  } catch(e) { next(e); }
});

// Leads
router.get('/leads/stats', getLeadStats);
router.get('/leads', getLeads);
router.get('/leads/:id', getLead);
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);

// Appointments
router.get('/appointments', getAppointments);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

// Blogs
router.get('/blogs', getAdminBlogs);
router.post('/blogs', createBlog);
router.get('/blogs/:id', getAdminBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

module.exports = router;
