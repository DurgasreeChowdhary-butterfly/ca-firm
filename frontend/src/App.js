import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ScrollToTop from './components/common/ScrollToTop';

// ── Public pages ──────────────────────────────────────────────────────────────
const Home              = lazy(() => import('./pages/Home'));
const About             = lazy(() => import('./pages/About'));
const Services          = lazy(() => import('./pages/Services'));
const ServiceDetail     = lazy(() => import('./pages/services/ServiceDetail'));
const Blog              = lazy(() => import('./pages/Blog'));
const BlogPost          = lazy(() => import('./pages/BlogPost'));
const Contact           = lazy(() => import('./pages/Contact'));
const BookAppointment   = lazy(() => import('./pages/BookAppointment'));
const ComplianceQuery   = lazy(() => import('./pages/ComplianceQuery'));
const DocumentUpload    = lazy(() => import('./pages/DocumentUpload'));
const PrivacyPolicy     = lazy(() => import('./pages/PrivacyPolicy'));
const Terms             = lazy(() => import('./pages/Terms'));
const Disclaimer        = lazy(() => import('./pages/Disclaimer'));

// ── Auth page (unified — handles login/signup/forgot/otp) ─────────────────────
const AuthPage          = lazy(() => import('./pages/auth/AuthPage'));

// ── Client dashboard ──────────────────────────────────────────────────────────
const ClientDashboard   = lazy(() => import('./pages/client/ClientDashboard'));

// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminLogin        = lazy(() => import('./pages/admin/Login'));
const AdminDashboard    = lazy(() => import('./pages/admin/Dashboard'));
const AdminLeads        = lazy(() => import('./pages/admin/Leads'));
const AdminAppointments = lazy(() => import('./pages/admin/Appointments'));
const AdminBlogs        = lazy(() => import('./pages/admin/Blogs'));
const AdminBlogEditor   = lazy(() => import('./pages/admin/BlogEditor'));

// ── Admin feature pages ───────────────────────────────────────────────────────
const AdminCompliance   = lazy(() => import('./pages/admin/features/ComplianceEngine'));
const AdminDocOCR       = lazy(() => import('./pages/admin/features/DocumentOCR'));
const AdminCalendar     = lazy(() => import('./pages/admin/features/StatutoryCalendar'));
const AdminMagicLinks   = lazy(() => import('./pages/admin/features/MagicLinks'));
const AdminDataSync     = lazy(() => import('./pages/admin/features/DataSync'));

// ── Route guards ──────────────────────────────────────────────────────────────
function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

function ClientRoute({ children }) {
  const { isClient, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return isClient ? children : <Navigate to="/login" replace />;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>

            {/* ── Public website ── */}
            <Route element={<Layout />}>
              <Route path="/"                   element={<Home />} />
              <Route path="/about"              element={<About />} />
              <Route path="/services"           element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              <Route path="/blog"               element={<Blog />} />
              <Route path="/blog/:slug"         element={<BlogPost />} />
              <Route path="/contact"            element={<Contact />} />
              <Route path="/book-appointment"   element={<BookAppointment />} />
              <Route path="/compliance-query"   element={<ComplianceQuery />} />
              <Route path="/upload-document"    element={<DocumentUpload />} />
              <Route path="/privacy-policy"     element={<PrivacyPolicy />} />
              <Route path="/terms"              element={<Terms />} />
              <Route path="/disclaimer"         element={<Disclaimer />} />
            </Route>

            {/* ── Unified Auth — /login (auto-redirects after login) ── */}
            <Route path="/login"  element={<AuthPage defaultView="login" />} />
            <Route path="/signup" element={<AuthPage defaultView="signup" />} />

            {/* ── Client dashboard (protected) ── */}
            <Route path="/client/dashboard" element={
              <ClientRoute><ClientDashboard /></ClientRoute>
            } />

            {/* ── Admin legacy login (keeps backward compat) ── */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── Admin panel (protected) ── */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index                element={<AdminDashboard />} />
              <Route path="leads"         element={<AdminLeads />} />
              <Route path="appointments"  element={<AdminAppointments />} />
              <Route path="blogs"         element={<AdminBlogs />} />
              <Route path="blogs/new"     element={<AdminBlogEditor />} />
              <Route path="blogs/:id"     element={<AdminBlogEditor />} />
              <Route path="compliance"    element={<AdminCompliance />} />
              <Route path="documents"     element={<AdminDocOCR />} />
              <Route path="calendar"      element={<AdminCalendar />} />
              <Route path="magic-links"   element={<AdminMagicLinks />} />
              <Route path="sync"          element={<AdminDataSync />} />
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
