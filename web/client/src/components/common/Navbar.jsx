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
                confirmButtonColor: '#255F38',
                background: '#ECFAE5',
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
                confirmButtonColor: '#255F38',
                background: '#ECFAE5',
            });
        } catch (error) {
            window.Swal.fire({
                icon: 'error',
                title: 'Peringatan',
                text: error.message,
                confirmButtonColor: '#255F38',
                background: '#ECFAE5',
            });
        }
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const links = [
        { path: '/', label: 'Beranda', icon: 'fa-home' },
        { path: '/pinjol', label: 'Daftar Pinjol', icon: 'fa-list' },
        { path: '/education', label: 'Edukasi', icon: 'fa-book' },
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
        ...(isAuthenticated
            ? []
            : [
                { path: '/login', label: 'Masuk', icon: 'fa-sign-in-alt' },
                { path: '/register', label: 'Daftar', icon: 'fa-user-plus' },
            ]),
    ];

    return (
        <motion.nav
            {...pageTransition}
            className="bg-pinjol-dark-4 text-pinjol-light-1 fixed w-full top-0 z-50 shadow-md"
        >
            <div className="container mx-auto px-[5%] py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src="/logo.png" alt="Get Pinjol Logo" className="h-10 mr-2" />
                    <span className="text-xl font-bold">Get Pinjol</span>
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="text-base font-medium hover:text-pinjol-light-2 transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Button
                            onClick={handleLogout}
                            className="bg-pinjol-dark-3 text-pinjol-light-1 hover:bg-pinjol-dark-4"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i> Keluar
                        </Button>
                    )}
                </div>
                <button
                    className="md:hidden text-pinjol-light-1 hover:text-pinjol-light-2 focus:outline-none"
                    onClick={toggleDrawer}
                    title="Buka menu"
                >
                    <i className="fas fa-bars text-2xl"></i>
                </button>
            </div>

            {/* Drawer untuk Mobile */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: isDrawerOpen ? 0 : '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-pinjol-dark-4 text-pinjol-light-1 z-50 shadow-lg md:hidden"
            >
                <div className="flex justify-between items-center p-4 border-b border-pinjol-light-2/20">
                    <span className="text-lg font-semibold">Menu</span>
                    <button
                        onClick={toggleDrawer}
                        className="text-pinjol-light-1 hover:text-pinjol-light-2"
                        title="Tutup menu"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div className="p-4 space-y-3">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={toggleDrawer}
                            className="flex items-center py-2 px-4 rounded-md hover:bg-pinjol-dark-3 transition-colors"
                        >
                            <i className={`fas ${link.icon} mr-3 text-pinjol-light-2`}></i>
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Button
                            onClick={() => {
                                handleLogout();
                                toggleDrawer();
                            }}
                            className="w-full text-left bg-pinjol-dark-3 text-pinjol-light-1 hover:bg-pinjol-dark-4"
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