import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import ReportForm from './pages/user/ReportForm';
import ReportEdit from './pages/user/ReportEdit';
import PinjolList from './pages/user/PinjolList';
import Education from './pages/user/Education';
import EducationDetail from './pages/user/EducationDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import PinjolManagement from './pages/admin/PinjolManagement';
import UserManagement from './pages/admin/UserManagement';
import EducationManagement from './pages/admin/EducationManagement';
import ReportVerification from './pages/admin/ReportVerification';
import AuthPresenter from './presenters/AuthPresenter';
import EducationPresenter from './presenters/EducationPresenter';
import { motion } from 'framer-motion';
import { pageTransition } from './utils/animations';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const authPresenter = new AuthPresenter({
    setLoading: setIsLoading,
    setToken: setIsAuthenticated,
    setRole,
    navigate,
    showError: (message) => console.error(message),
    showSuccess: (message) => console.log(message),
  });

  const educationPresenter = new EducationPresenter({
    setLoading: setIsLoading,
    showError: (message) => console.error(message),
    showSuccess: (message) => console.log(message),
    setEducations: () => {},
    navigate,
  });

  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const controller = new AbortController();
    authPresenter.checkAuthStatus(controller.signal).then(() => {
      if (isAuthenticated && role) {
        educationPresenter.syncOfflineEducations(localStorage.getItem('token'));
        if (role === 'admin' && !location.pathname.startsWith('/admin')) {
          navigate('/admin', { replace: true });
        } else if (role === 'user' && !location.pathname.startsWith('/dashboard') && !location.pathname.match(/^\/(education|pinjol)/)) {
          navigate('/dashboard', { replace: true });
        }
      } else {
        if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')) {
          navigate('/', { replace: true });
        }
      }
      setIsLoading(false);
    }).catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')) {
          navigate('/', { replace: true });
        }
        setIsLoading(false);
      }
    });
    return () => controller.abort();
  }, []); // Run once on mount

  if (isLoading) {
    return <div className="spinner"><div></div></div>;
  }

  return (
    <motion.div {...pageTransition} className="flex flex-col min-h-screen w-full">
      {!hideHeaderFooter && (
        <Header
          isAuthenticated={isAuthenticated}
          role={role}
          setIsAuthenticated={setIsAuthenticated}
          setRole={setRole}
          className="w-full"
        />
      )}
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pinjol" element={<PinjolList />} />
          <Route path="/education" element={<Education />} />
          <Route path="/education/:id" element={<EducationDetail />} />
          {isAuthenticated && role === 'user' && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/report/new" element={<ReportForm />} />
              <Route path="/report/edit/:id" element={<ReportEdit />} />
            </>
          )}
          {isAuthenticated && role === 'admin' && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/pinjol" element={<PinjolManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/education" element={<EducationManagement />} />
              <Route path="/admin/reports" element={<ReportVerification />} />
            </>
          )}
          <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </motion.div>
  );
}

export default App;