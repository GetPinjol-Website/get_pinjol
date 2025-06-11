import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPresenter from '../../presenters/AuthPresenter';
import Button from './Button';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Navbar({ isAuthenticated, role, setIsAuthenticated, setRole }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const presenter = new AuthPresenter({
    showError: (message) => {
      window.Swal.fire({
        icon: 'error',
        title: 'Peringatan',
        text: message,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
        fontFamily: 'Roboto, sans-serif',
      });
    },
    setToken: setIsAuthenticated,
    setRole,
    navigate,
  });

  const handleLogout = () => {
    try {
      presenter.handleLogout();
      setIsDrawerOpen(false);
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil Keluar',
        text: 'Anda telah keluar dari sistem.',
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
        fontFamily: 'Roboto, sans-serif',
      });
    } catch (error) {
      window.Swal.fire({
        icon: 'error',
        title: 'Peringatan',
        text: error.message,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
        fontFamily: 'Roboto, sans-serif',
      });
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const generalLinks = [
    { path: '/', label: 'Beranda', icon: 'fa-home' },
    { path: '/reports', label: 'Laporan', icon: 'fa-file-alt' },
    { path: '/pinjol', label: 'Daftar Pinjol', icon: 'fa-list' },
    { path: '/education', label: 'Edukasi', icon: 'fa-book' },
  ];

  const links = [
    ...generalLinks,
    ...(isAuthenticated && role === 'user'
      ? [{ path: '/dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' }]
      : []),
    ...(isAuthenticated && role === 'admin'
      ? [
          { path: '/admin', label: 'Admin Dashboard', icon: 'fa-tachometer-alt' },
          { path: '/admin/pinjol', label: 'Manajemen Pinjol', icon: 'fa-list' },
          { path: '/admin/users', label: 'Manajemen Pengguna', icon: 'fa-users' },
          { path: '/admin/education', label: 'Manajemen Edukasi', icon: 'fa-book' },
          { path: '/admin/reports', label: 'Verifikasi Laporan', icon: 'fa-check-circle' },
        ]
      : []),
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-pinjol-dark-1 fixed w-full top-0 z-50 shadow-md font-roboto"
    >
      <div className="hidden md:flex items-center justify-between px-6 py-4 bg-white text-pinjol-dark-1">
        <Link to="/" className="flex items-center hover:no-underline">
          <img src="/logo.png" alt="Get Pinjol Logo" className="h-12 mr-2" />
          <span className="text-xl font-semibold">Get Pinjol</span>
        </Link>
        <div className="flex items-center space-x-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:no-underline text-base hover:bg-pinjol-light-1 hover:text-pinjol-dark-3 px-3 py-2 rounded transition-all duration-300 transform hover:scale-105"
            >
              <i className={`fas ${link.icon} mr-2`}></i> {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <>
              <Button
                onClick={() => navigate('/register')}
                className="bg-pinjol-dark-1 text-pinjol-light-1 hover:bg-pinjol-dark-2 transition duration-300 transform hover:scale-105"
              >
                Daftar
              </Button>
              <Button
                onClick={() => navigate('/login')}
                className="bg-pinjol-light-1 text-pinjol-dark-1 hover:bg-pinjol-light-2 transition duration-300 transform hover:scale-105"
              >
                Masuk
              </Button>
            </>
          )}
          {isAuthenticated && (
            <Button
              onClick={handleLogout}
              className="bg-pinjol-dark-1 text-pinjol-light-1 hover:bg-pinjol-dark-2 transition duration-300 transform hover:scale-105"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Keluar
            </Button>
          )}
        </div>
      </div>

      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white text-pinjol-dark-1">
        <Link to="/" className="flex items-center hover:no-underline">
          <img src="/logo.png" alt="Get Pinjol Logo" className="h-12 mr-2" />
          <span className="text-lg font-semibold">Get Pinjol</span>
        </Link>
        <div className="flex justify-end">
          <button className="p-1 text-pinjol-dark-1" onClick={toggleDrawer}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isDrawerOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white text-pinjol-dark-1 z-50 shadow-md font-roboto md:hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-pinjol-dark-4">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={toggleDrawer} className="text-pinjol-dark-1">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={toggleDrawer}
              className="hover:no-underline block py-2 px-4 text-sm hover:bg-pinjol-light-1 hover:text-pinjol-dark-3 transition-all duration-300"
            >
              <i className={`fas ${link.icon} mr-2`}></i> {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => {
                  navigate('/register');
                  toggleDrawer();
                }}
                className="w-[48%] bg-pinjol-dark-1 text-pinjol-light-1 hover:bg-pinjol-dark-2 transition duration-300"
              >
                Daftar
              </Button>
              <Button
                onClick={() => {
                  navigate('/login');
                  toggleDrawer();
                }}
                className="w-[48%] bg-pinjol-light-1 text-pinjol-dark-1 hover:bg-pinjol-light-2 transition duration-300"
              >
                Masuk
              </Button>
            </div>
          )}
          {isAuthenticated && (
            <Button
              onClick={() => {
                handleLogout();
                toggleDrawer();
              }}
              className="w-full bg-pinjol-dark-1 text-pinjol-light-1 hover:bg-pinjol-dark-2 transition duration-300 mt-4"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Keluar
            </Button>
          )}
        </div>
      </motion.div>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-pinjol-dark-1/50 z-40 md:hidden"
          onClick={toggleDrawer}
        ></div>
      )}
    </motion.nav>
  );
}

export default Navbar;