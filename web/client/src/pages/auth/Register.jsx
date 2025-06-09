import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPresenter from '../../presenters/AuthPresenter';
import Form from '../../components/ui/Form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import { isValidEmail } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations.jsx';

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
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.email || !formData.password) {
            setError('Semua field wajib diisi');
            return;
        }
        if (!isValidEmail(formData.email)) {
            setError('Email tidak valid');
            return;
        }
        await presenter.handleRegister(formData);
    };

    return (
        <motion.div {...pageTransition} className="container mx-auto max-w-md p-4">
            <h1 className="text-2xl font-bold text-dark-green-900 mb-4">Register</h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            <SuccessMessage message={success} onClose={() => setSuccess('')} />
            {isLoading && <Spinner />}
            <Form onSubmit={handleSubmit}>
                <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <div className="mb-4">
                    <label className="block text-dark-green-900 font-medium mb-1">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-cream-200"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <Button type="submit" disabled={isLoading}>
                    Register
                </Button>
            </Form>
        </motion.div>
    );
}

export default Register;