import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPresenter from '../../presenters/AuthPresenter';
import Form from '../../components/ui/Form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import FullScreenSection from '../../components/ui/FullScreenSection';
import { isValidEmail } from '../../utils/helpers';
import { motion } from 'framer-motion';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const presenter = new AuthPresenter({
        setLoading: setIsLoading,
        showError: setError,
        showSuccess: setSuccess,
        navigate,
        setToken: () => { }, // Placeholder for token state
        setRole: () => { }, // Placeholder for role state
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.email || !formData.password) {
            setError('Semua kolom wajib diisi');
            return;
        }
        if (!isValidEmail(formData.email)) {
            setError('Email tidak valid');
            return;
        }
        await presenter.handleRegister(formData);
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <FullScreenSection id="register" className="bg-pinjol-light-1 relative overflow-hidden">
            <div
                className="absolute inset-0 bg-[url('/landing/getpinjol-security-shield.jpg')] bg-cover bg-center opacity-10"
            ></div>
            <motion.div
                className="relative z-10 bg-pinjol-light-2 p-8 rounded-lg shadow-lg max-w-3xl w-full mx-auto font-roboto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h1
                    className="text-3xl font-bold text-pinjol-dark-3 mb-6 text-center"
                    variants={itemVariants}
                >
                    Daftar ke Get Pinjol
                </motion.h1>
                <motion.p
                    className="text-pinjol-dark-1 mb-8 text-center"
                    variants={itemVariants}
                >
                    Bergabunglah sekarang dan mulai lindungi keuangan Anda dari pinjol berisiko!
                </motion.p>
                <ErrorMessage message={error} onClose={() => setError('')} />
                <SuccessMessage message={success} onClose={() => setSuccess('')} />
                {isLoading && <Spinner />}
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div className="mb-4" variants={itemVariants}>
                            <label className="flex items-center text-pinjol-dark-2 font-medium mb-2 relative [input:required_~_&]:after:content-['*'] [input:required_~_&]:after:text-red-500 [input:required_~_&]:after:ml-1">
                                <i className="fas fa-user mr-2"></i>
                                Username
                            </label>
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Masukkan username Anda"
                                className="w-full px-4 py-3 border-2 border-pinjol-light-4 rounded-lg text-pinjol-dark-1 focus:outline-none focus:border-pinjol-dark-3 focus:ring-2 focus:ring-pinjol-dark-3 transition-all"
                                required
                            />
                        </motion.div>
                        <motion.div className="mb-4" variants={itemVariants}>
                            <label className="flex items-center text-pinjol-dark-2 font-medium mb-2 relative [input:required_~_&]:after:content-['*'] [input:required_~_&]:after:text-red-500 [input:required_~_&]:after:ml-1">
                                <i className="fas fa-envelope mr-2"></i>
                                Email
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Masukkan email Anda"
                                className="w-full px-4 py-3 border-2 border-pinjol-light-4 rounded-lg text-pinjol-dark-1 focus:outline-none focus:border-pinjol-dark-3 focus:ring-2 focus:ring-pinjol-dark-3 transition-all"
                                required
                            />
                        </motion.div>
                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="flex items-center text-pinjol-dark-2 font-medium mb-2 relative [input:required_~_&]:after:content-['*'] [input:required_~_&]:after:text-red-500 [input:required_~_&]:after:ml-1">
                                <i className="fas fa-lock mr-2"></i>
                                Password
                            </label>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Masukkan password Anda"
                                className="w-full px-4 py-3 border-2 border-pinjol-light-4 rounded-lg text-pinjol-dark-1 focus:outline-none focus:border-pinjol-dark-3 focus:ring-2 focus:ring-pinjol-dark-3 transition-all"
                                required
                            />
                        </motion.div>
                        <motion.div className="mb-6" variants={itemVariants}>
                            <label className="flex items-center text-pinjol-dark-2 font-medium mb-2 relative [select_~_&]:after:content-['']">
                                <i className="fas fa-user-tag mr-2"></i>
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-pinjol-light-4 rounded-lg text-pinjol-dark-1 focus:outline-none focus:border-pinjol-dark-3 focus:ring-2 focus:ring-pinjol-dark-3 transition-all"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </motion.div>
                    </div>
                    <motion.div variants={itemVariants}>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-pinjol-dark-3 text-white rounded-lg font-medium hover:bg-pinjol-dark-2 transition-colors flex items-center justify-center"
                        >
                            <i className="fas fa-user-plus mr-2"></i>Daftar
                        </Button>
                    </motion.div>
                </Form>
                <motion.p
                    className="mt-4 text-center text-pinjol-dark-1"
                    variants={itemVariants}
                >
                    Sudah punya akun?{' '}
                    <a href="/login" className="text-pinjol-dark-3 hover:underline">
                        Masuk sekarang
                    </a>
                </motion.p>
            </motion.div>
        </FullScreenSection>
    );
}

export default Register;