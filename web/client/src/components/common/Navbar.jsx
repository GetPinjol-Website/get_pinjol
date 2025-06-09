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
        <motion.nav {...pageTransition} className="bg-dark-green-900 text-cream-100">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    Pinjol Report
                </Link>
                <div className="hidden md:flex space-x-4">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="hover:text-light-green-300"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Button onClick={handleLogout} className="ml-4">
                            Logout
                        </Button>
                    )}
                </div>
                <button
                    className="md:hidden text-cream-100"
                    onClick={toggleMobileMenu}
                >
                    ☰
                </button>
            </div>
            {isMobileMenuOpen && (
                <div className="md:hidden bg-dark-green-800 p-4">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="block py-2 hover:text-light-green-300"
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
                            className="mt-2 w-full text-left"
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