import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPresenter from '../../presenters/AuthPresenter';
import Form from '../../components/ui/Form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import { isValidUsername } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Login({ setIsAuthenticated, setRole }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const presenter = new AuthPresenter({
        setLoading: setIsLoading,
        showError: setError,
        showSuccess: setSuccess,
        navigate,
        setToken: setIsAuthenticated,
        setRole,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.password) {
            setError('Username dan password wajib diisi');
            return;
        }
        if (!isValidUsername(formData.username)) {
            setError('Username tidak valid');
            return;
        }
        console.log('Data login yang dikirim:', formData);
        const credentials = {
            username: formData.username,
            password: formData.password,
        };
        try {
            await presenter.handleLogin(credentials);
            setIsAuthenticated(true);
        } catch (error) {
            setError(error.message || 'Login gagal');
        }
    };

    return (
        <motion.div
            {...pageTransition}
            className="min-h-screen bg-pinjol-light-1 flex items-center justify-center font-roboto relative overflow-hidden py-8"
        >
            <div
                className="absolute inset-0 bg-[url('/landing/getpinjol-security-shield.jpg')] bg-cover bg-center opacity-10"
            ></div>
            <div className="relative z-10 bg-pinjol-light-2 p-8 rounded-lg shadow-lg max-w-3xl w-full mx-auto font-roboto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 text-center">
                        Masuk ke Get Pinjol
                    </h1>
                    <p className="text-pinjol-dark-1 mb-8 text-center">
                        Akses platform keamanan pinjol terbaik untuk melindungi keuangan Anda!
                    </p>
                    <ErrorMessage message={error} onClose={() => setError('')} />
                    <SuccessMessage message={success} onClose={() => setSuccess('')} />
                    {isLoading && <Spinner />}
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-pinjol-dark-2 font-medium mb-2">
                                <i className="fas fa-user mr-2"></i>Username
                            </label>
                            <Input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Masukkan username Anda"
                                className="w-full px-4 py-3 border-2 border-pinjol-light-4 rounded-lg text-pinjol-dark-1 focus:outline-none focus:border-pinjol-dark-3 focus:ring-2 focus:ring-pinjol-dark-3 transition-all"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-pinjol-dark-2 font-medium mb-2">
                                <i className="fas fa-lock mr-2"></i>Password
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
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-pinjol-dark-3 text-white rounded-lg font-medium hover:bg-pinjol-dark-2 transition-colors flex items-center justify-center"
                        >
                            <i className="fas fa-sign-in-alt mr-2"></i>Masuk
                        </Button>
                    </Form>
                    <p className="mt-4 text-center text-pinjol-dark-1">
                        Belum punya akun?{' '}
                        <a href="/register" className="text-pinjol-dark-3 hover:underline">
                            Daftar sekarang
                        </a>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default Login;