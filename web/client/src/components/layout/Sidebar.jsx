import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

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
        <motion.aside {...pageTransition} className="sidebar">
            <h2>{role === 'admin' ? 'Admin Panel' : 'User Panel'}</h2>
            <ul>
                {links.map((link) => (
                    <li key={link.path}>
                        <Link to={link.path}>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </motion.aside>
    );
}

export default Sidebar;