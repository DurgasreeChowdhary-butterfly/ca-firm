import ScrollToTop from './components/common/ScrollToTop';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/services/ServiceDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
const ComplianceQuery = lazy(() => import('./pages/ComplianceQuery'));
const DocumentUpload = lazy(() => import('./pages/DocumentUpload'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLeads = lazy(() => import('./pages/admin/Leads'));
const AdminAppointments = lazy(() => import('./pages/admin/Appointments'));
const AdminBlogs = lazy(() => import('./pages/admin/Blogs'));
const AdminBlogEditor = lazy(() => import('./pages/admin/BlogEditor'));
const AdminComplianceEngine = lazy(() => import('./pages/admin/features/ComplianceEngine'));
const AdminDocumentOCR = lazy(() => import('./pages/admin/features/DocumentOCR'));
const AdminStatutoryCalendar = lazy(() => import('./pages/admin/features/StatutoryCalendar'));
const AdminMagicLinks = lazy(() => import('./pages/admin/features/MagicLinks'));
const AdminDataSync = lazy(() => import('./pages/admin/features/DataSync'));

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <ScrollToTop />
        <Suspense fallback={<LoadingSpinner fullPage />}>
            <Routes>
              {/* Public routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route path="/compliance-query" element={<ComplianceQuery />} />
                <Route path="/upload-document" element={<DocumentUpload />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/leads" element={<AdminLeads />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                <Route path="/admin/blogs" element={<AdminBlogs />} />
                <Route path="/admin/blogs/new" element={<AdminBlogEditor />} />
                <Route path="/admin/blogs/edit/:id" element={<AdminBlogEditor />} />
                <Route path="/admin/compliance" element={<AdminComplianceEngine />} />
                <Route path="/admin/documents" element={<AdminDocumentOCR />} />
                <Route path="/admin/calendar" element={<AdminStatutoryCalendar />} />
                <Route path="/admin/magic-links" element={<AdminMagicLinks />} />
                <Route path="/admin/sync" element={<AdminDataSync />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
