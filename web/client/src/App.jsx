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
import PinjolList from './pages/user/PinjolList';
import Education from './pages/user/Education';
import AdminDashboard from './pages/admin/AdminDashboard';
import PinjolManagement from './pages/admin/PinjolManagement';
import UserManagement from './pages/admin/UserManagement';
import EducationManagement from './pages/admin/EducationManagement';
import ReportVerification from './pages/admin/ReportVerification';
import AuthPresenter from './presenters/AuthPresenter';
import { motion } from 'framer-motion';
import { pageTransition } from './utils/animations';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const presenter = new AuthPresenter({
    setLoading: setIsLoading,
    setToken: setIsAuthenticated,
    setRole,
    navigate,
    showError: (message) => alert(message),
    showSuccess: (message) => console.log(message),
  });

  useEffect(() => {
    const controller = new AbortController();
    presenter.checkAuthStatus(controller.signal).catch((error) => {
      console.error('Error checking auth status:', error);
      setIsLoading(false);
    });
    return () => controller.abort();
  }, []);

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
          <Route path="/pinjol" element={<PinjolList />} />
          <Route path="/education" element={<Education />} />
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
      <Footer className="w-full" />
    </motion.div>
  );
}

export default App;