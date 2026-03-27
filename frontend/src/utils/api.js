import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ca_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('ca_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Public APIs
export const submitLead = (data) => api.post('/leads', data);
export const getAvailableSlots = (date) => api.get(`/appointments/slots?date=${date}`);
export const bookAppointment = (data) => api.post('/appointments', data);
export const getBlogs = (params) => api.get('/blogs', { params });
export const getBlogBySlug = (slug) => api.get(`/blogs/${slug}`);

// Admin Auth
export const adminLogin = (credentials) => api.post('/auth/login', credentials);
export const getAdminMe = () => api.get('/auth/me');
export const changePassword = (data) => api.put('/auth/change-password', data);

// Admin - Leads
export const getLeads = (params) => api.get('/admin/leads', { params });
export const updateLead = (id, data) => api.put(`/admin/leads/${id}`, data);
export const deleteLead = (id) => api.delete(`/admin/leads/${id}`);
export const getLeadStats = () => api.get('/admin/leads/stats');

// Admin - Appointments
export const getAppointments = (params) => api.get('/admin/appointments', { params });
export const updateAppointment = (id, data) => api.put(`/admin/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/admin/appointments/${id}`);

// Admin - Blogs
export const getAdminBlogs = (params) => api.get('/admin/blogs', { params });
export const getAdminBlog = (id) => api.get(`/admin/blogs/${id}`);
export const createBlog = (data) => api.post('/admin/blogs', data);
export const updateBlog = (id, data) => api.put(`/admin/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/admin/blogs/${id}`);

// Admin - Dashboard stats
export const getDashboardStats = () => api.get('/admin/stats');

export default api;

// ── Feature 1: Compliance Engine ──
export const submitComplianceQuery = (data) => api.post('/compliance/query', data);
export const getAdminComplianceQueries = (params) => api.get('/admin/compliance', { params });
export const updateComplianceQuery = (id, data) => api.put(`/admin/compliance/${id}`, data);

// ── Feature 2: Document OCR ──
export const uploadDocument = (formData) => api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getAdminDocuments = (params) => api.get('/admin/documents', { params });
export const getDocumentStats = () => api.get('/admin/documents/stats');
export const reviewDocument = (id, data) => api.put(`/admin/documents/${id}/review`, data);

// ── Feature 3: Statutory Calendar ──
export const generateCalendar = (data) => api.post('/calendar/generate', data);
export const getClientCalendar = (email, fy) => api.get(`/calendar/${email}`, { params: { fy } });
export const getUpcomingDeadlines = (days) => api.get('/admin/calendar/upcoming', { params: { days } });
export const markComplianceDone = (calendarId, idx, data) => api.put(`/admin/calendar/${calendarId}/complete/${idx}`, data);

// ── Feature 4: Magic Link ──
export const requestMagicLink = (data) => api.post('/magic-link/request', data);
export const validateMagicLink = (data) => api.post('/magic-link/validate', data);
export const getMagicLinks = (params) => api.get('/admin/magic-links', { params });
export const revokeTokens = (email) => api.delete(`/admin/magic-links/revoke/${email}`);

// ── Feature 5: Data Sync ──
export const triggerDemoSync = (data) => api.post('/sync/demo/trigger', data);
export const getSyncRecords = (params) => api.get('/admin/sync/records', { params });
export const getSyncStats = () => api.get('/admin/sync/stats');
export const resolveSyncConflict = (id, data) => api.put(`/admin/sync/${id}/resolve`, data);
