import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';

// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/ManageCategories';

// Layout wrapper for customer-facing pages (with Navbar)
const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* ── Public Routes ─────────────────────────── */}
          <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<CustomerLayout><Cars /></CustomerLayout>} />
          <Route path="/cars/:id" element={<CustomerLayout><CarDetails /></CustomerLayout>} />

          {/* ── Customer Routes ────────────────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['customer']}>
                <CustomerLayout><CustomerDashboard /></CustomerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute roles={['customer']}>
                <CustomerLayout><MyBookings /></CustomerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={['customer']}>
                <CustomerLayout><Profile /></CustomerLayout>
              </ProtectedRoute>
            }
          />

          {/* ── Admin Routes ───────────────────────────── */}
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/cars"
            element={<ProtectedRoute roles={['admin']}><ManageCars /></ProtectedRoute>}
          />
          <Route
            path="/admin/bookings"
            element={<ProtectedRoute roles={['admin']}><ManageBookings /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>}
          />
          <Route
            path="/admin/categories"
            element={<ProtectedRoute roles={['admin']}><ManageCategories /></ProtectedRoute>}
          />

          {/* ── Fallback ───────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
