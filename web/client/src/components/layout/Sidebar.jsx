import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Sidebar({ role }) {
  const adminLinks = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/pinjol', label: 'Pinjol Management' },
    { path: '/admin/users', label: 'User Management' },
    { path: '/admin/education', label: 'Education Management' },
    { path: '/admin/reports', label: 'Report Verification' },
  ];

  const userLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/report/new', label: 'Create Report' },
    { path: '/pinjol', label: 'Pinjol List' },
    { path: '/education', label: 'Education' },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <motion.aside {...pageTransition} className="bg-pgray-light-3 p-4 shadow-inner">
      <h2 className="text-xl font-bold text-pgray-dark-2 mb-4">
        {role === 'admin' ? 'Admin Panel' : 'User Panel'}
      </h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="block py-2 px-4 hover:bg-pgray-light-4 rounded"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}

export default Sidebar;