import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Sidebar({ role, onLogout }) {
  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { path: '/admin/pinjol', label: 'Manajemen Pinjol', icon: 'fa-list' },
    { path: '/admin/users', label: 'Manajemen Pengguna', icon: 'fa-users' },
    { path: '/admin/education', label: 'Manajemen Edukasi', icon: 'fa-book' },
    { path: '/admin/reports', label: 'Verifikasi Laporan', icon: 'fa-check-circle' },
  ];

  const userLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { path: '/report/new', label: 'Buat Laporan', icon: 'fa-file-alt' },
    { path: '/pinjol', label: 'Daftar Pinjol', icon: 'fa-list' },
    { path: '/education', label: 'Edukasi', icon: 'fa-book' },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <motion.aside
      {...pageTransition}
      className="hidden md:block bg-white text-pinjol-dark-1 w-64 min-h-full shadow-md font-roboto flex flex-col z-0"
    >
      <div className="flex justify-between items-center p-4 border-b border-pinjol-dark-4">
        <span className="text-lg font-semibold">
          {role === 'admin' ? 'Admin Panel' : 'User Panel'}
        </span>
      </div>
      <ul className="flex-grow p-4 space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="flex items-center py-2 px-4 hover:bg-pinjol-light-1 hover:text-pinjol-dark-3 rounded transition-all duration-300"
            >
              <i className={`fas ${link.icon} mr-2`}></i> {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="p-4">
        <button
          onClick={onLogout}
          className="w-full bg-pinjol-dark-1 text-pinjol-light-1 hover:bg-pinjol-dark-2 transition duration-300 py-2 rounded">
          <i className="fas fa-sign-out-alt mr-2"></i> Keluar
        </button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;