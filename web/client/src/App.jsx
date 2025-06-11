import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import ReportForm from './pages/user/ReportForm';
import ReportEdit from './pages/user/ReportEdit';
import ReportList from './pages/user/ReportList';
import PinjolList from './pages/user/PinjolList';
import Education from './pages/user/Education';
import AdminDashboard from './pages/admin/AdminDashboard';
import PinjolManagement from './pages/admin/PinjolManagement';
import UserManagement from './pages/admin/UserManagement';
import EducationManagement from './pages/admin/EducationManagement';
import ReportVerification from './pages/admin/ReportVerification';
import AuthPresenter from './presenters/AuthPresenter';
import ReportPresenter from './presenters/ReportPresenter';
import { motion } from 'framer-motion';
import { pageTransition } from './utils/animations';
import { isOnline } from './utils/helpers';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(!isOnline());
  const navigate = useNavigate();

  const authPresenter = new AuthPresenter({
    setLoading: setIsLoading,
    setToken: setIsAuthenticated,
    setRole,
    navigate,
    showError: (message) =>
      window.Swal.fire({
        icon: 'error',
        title: 'Peringatan',
        text: message,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      }),
    showSuccess: (message) =>
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: message,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      }),
  });

  const reportPresenter = new ReportPresenter({
    setLoading: setIsLoading,
    showError: (message) =>
      window.Swal.fire({
        icon: 'error',
        title: 'Peringatan',
        text: message,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      }),
    showSuccess: (message) =>
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: message,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      }),
    navigate,
  });

  useEffect(() => {
    const controller = new AbortController();
    authPresenter.checkAuthStatus(controller.signal).catch((error) => {
      console.error('Error checking auth status:', error);
      setIsLoading(false);
    });

    const handleOffline = () => {
      window.Swal.fire({
        icon: 'warning',
        title: 'Anda sedang offline',
        text: 'Mau beralih ke mode offline untuk CRUD laporan?',
        showCancelButton: true,
        confirmButtonText: 'Ya, beralih',
        cancelButtonText: 'Tidak',
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      }).then((result) => {
        if (result.isConfirmed) {
          setIsOfflineMode(true);
        }
      });
    };

    const handleOnline = () => {
      setIsOfflineMode(false);
      if (isAuthenticated) {
        reportPresenter.syncOfflineReports();
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      controller.abort();
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return <div className="spinner"><div></div></div>;
  }

  return (
    <motion.div {...pageTransition} className="flex flex-col min-h-screen w-full">
      <Header
        isAuthenticated={isAuthenticated}
        role={role}
        setIsAuthenticated={setIsAuthenticated}
        setRole={setRole}
        className="w-full"
      />
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reports" element={<ReportList isOfflineMode={isOfflineMode} />} />
          <Route path="/pinjol" element={<PinjolList />} />
          <Route path="/education" element={<Education />} />
          {isAuthenticated && role === 'user' && (
            <>
              <Route path="/dashboard" element={<Dashboard isOfflineMode={isOfflineMode} />} />
              <Route path="/report/new" element={<ReportForm isOfflineMode={isOfflineMode} />} />
              <Route path="/report/edit/:id" element={<ReportEdit isOfflineMode={isOfflineMode} />} />
            </>
          )}
          {isAuthenticated && role === 'admin' && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/pinjol" element={<PinjolManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/education" element={<EducationManagement />} />
              <Route path="/admin/reports" element={<ReportVerification isOfflineMode={isOfflineMode} />} />
            </>
          )}
          <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
        </Routes>
      </main>
      <Footer className="w-full" />
    </motion.div>
  );
}

export default App;