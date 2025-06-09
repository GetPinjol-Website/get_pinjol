import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPresenter from '../../presenters/AuthPresenter';
import Button from './Button';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Navbar({ isAuthenticated, role, setIsAuthenticated, setRole }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const presenter = new AuthPresenter({
        showError: (message) => alert(message),
        setToken: setIsAuthenticated,
        setRole,
        navigate,
    });

    const handleLogout = () => {
        try {
            presenter.handleLogout();
        } catch (error) {
            alert(error.message);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const links = [
        { path: '/', label: 'Beranda' },
        { path: '/pinjol', label: 'Daftar Pinjol' },
        { path: '/education', label: 'Edukasi' },
        ...(isAuthenticated && role === 'user'
            ? [{ path: '/dashboard', label: 'Dashboard' }]
            : []),
        ...(isAuthenticated && role === 'admin'
            ? [
                { path: '/admin', label: 'Admin Dashboard' },
                { path: '/admin/pinjol', label: 'Manajemen Pinjol' },
                { path: '/admin/users', label: 'Manajemen Pengguna' },
                { path: '/admin/education', label: 'Manajemen Edukasi' },
                { path: '/admin/reports', label: 'Verifikasi Laporan' },
            ]
            : []),
        ...(isAuthenticated
            ? []
            : [
                { path: '/login', label: 'Login' },
                { path: '/register', label: 'Register' },
            ]),
    ];

    return (
        <motion.nav {...pageTransition} className="navbar">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    Pinjol Report
                </Link>
                <div className="navbar-links">
                    {links.map((link) => (
                        <Link key={link.path} to={link.path}>
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Button onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                </div>
                <button
                    className="navbar-toggle"
                    onClick={toggleMobileMenu}
                >
                    ☰
                </button>
            </div>
            {isMobileMenuOpen && (
                <div className="navbar-mobile">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={toggleMobileMenu}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Button
                            onClick={() => {
                                handleLogout();
                                toggleMobileMenu();
                            }}
                        >
                            Logout
                        </Button>
                    )}
                </div>
            )}
        </motion.nav>
    );
}

export default Navbar;