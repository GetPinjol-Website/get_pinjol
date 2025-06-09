import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserModel from './models/UserModel';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/user/Dashboard';
import ReportForm from './pages/user/ReportForm';
import ReportEdit from './pages/user/ReportEdit';
import PinjolList from './pages/user/PinjolList';
import Education from './pages/user/Education';
import AdminDashboard from './pages/admin/AdminDashboard';
import PinjolManagement from './pages/admin/PinjolManagement';
import UserManagement from './pages/admin/UserManagement';
import EducationManagement from './pages/admin/EducationManagement';
import ReportVerification from './pages/admin/ReportVerification';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { isOnline } from './utils/helpers';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default ke false
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      const token = UserModel.getToken();
      if (isOnline() && token) {
        try {
          setIsLoading(true);
          const userRole = await UserModel.checkRole();
          if (mounted) {
            setRole(userRole);
            setIsAuthenticated(!!userRole);
          }
        } catch (error) {
          if (mounted) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            setRole(null);
            // Hapus token invalid dari localStorage jika ada
            if (token) UserModel.logout();
          }
        } finally {
          if (mounted) setIsLoading(false);
        }
      } else {
        if (mounted) {
          setIsAuthenticated(false);
          setRole(null);
          setIsLoading(false);
        }
      }
    };
    checkAuth();
    return () => (mounted = false);
  }, []);

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (requiredRole && role !== requiredRole) return <Navigate to="/" />;
    return children;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cream-100 bg-opacity-75">
        <div className="animate-spin h-8 w-8 border-4 border-green-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 text-dark-green-900">
      <Header
        isAuthenticated={isAuthenticated}
        role={role}
        setIsAuthenticated={setIsAuthenticated}
        setRole={setRole}
      />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="user"><Dashboard /></ProtectedRoute>} />
          <Route path="/report/new" element={<ProtectedRoute requiredRole="user"><ReportForm /></ProtectedRoute>} />
          <Route path="/report/edit/:id" element={<ProtectedRoute requiredRole="user"><ReportEdit /></ProtectedRoute>} />
          <Route path="/pinjol" element={<PinjolList />} />
          <Route path="/education" element={<Education />} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/pinjol" element={<ProtectedRoute requiredRole="admin"><PinjolManagement /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/education" element={<ProtectedRoute requiredRole="admin"><EducationManagement /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><ReportVerification /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;