import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations.jsx';

function Sidebar({ role }) {
    const adminLinks = [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/pinjol', label: 'Manajemen Pinjol' },
        { path: '/admin/users', label: 'Manajemen Pengguna' },
        { path: '/admin/education', label: 'Manajemen Edukasi' },
        { path: '/admin/reports', label: 'Verifikasi Laporan' },
    ];

    const userLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/report/new', label: 'Buat Laporan' },
        { path: '/pinjol', label: 'Daftar Pinjol' },
        { path: '/education', label: 'Edukasi' },
    ];

    const links = role === 'admin' ? adminLinks : userLinks;

    return (
        <motion.aside {...pageTransition} className="bg-dark-green-800 text-cream-100 w-64 p-4 h-screen fixed">
            <h2 className="text-xl font-bold mb-4">{role === 'admin' ? 'Admin Panel' : 'User Panel'}</h2>
            <ul>
                {links.map((link) => (
                    <li key={link.path} className="mb-2">
                        <Link to={link.path} className="hover:text-light-green-300">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </motion.aside>
    );
}

export default Sidebar;