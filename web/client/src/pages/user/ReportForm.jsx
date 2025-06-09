import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import Form from '../../components/ui/Form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import { REPORT_CATEGORIES } from '../../utils/constants';
import { isValidDate } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations.jsx';

function ReportForm() {
    const [formData, setFormData] = useState({
        appName: '',
        description: '',
        category: '',
        incidentDate: '',
        evidence: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const presenter = new ReportPresenter({
        setLoading: setIsLoading,
        showError: setError,
        showSuccess: setSuccess,
        navigate,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.appName || !formData.description || !formData.category || !formData.incidentDate) {
            setError('Semua field kecuali bukti wajib diisi');
            return;
        }
        if (!isValidDate(formData.incidentDate)) {
            setError('Tanggal kejadian tidak valid');
            return;
        }
        await presenter.createWebReport(formData);
    };

    return (
        <motion.div {...pageTransition} className="container mx-auto max-w-md p-4">
            <h1 className="text-2xl font-bold text-dark-green-900 mb-4">Buat Laporan</h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            <SuccessMessage message={success} onClose={() => setSuccess('')} />
            {isLoading && <Spinner />}
            <Form onSubmit={handleSubmit}>
                <Input
                    label="Nama Aplikasi"
                    name="appName"
                    value={formData.appName}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Deskripsi"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <div className="mb-4">
                    <label className="block text-dark-green-900 font-medium mb-1">
                        Kategori<span className="text-red-500">*</span>
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-cream-200"
                        required
                    >
                        <option value="">Pilih Kategori</option>
                        {REPORT_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <Input
                    label="Tanggal Kejadian"
                    type="date"
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Bukti (opsional)"
                    name="evidence"
                    value={formData.evidence}
                    onChange={handleChange}
                />
                <Button type="submit" disabled={isLoading}>
                    Kirim Laporan
                </Button>
            </Form>
        </motion.div>
    );
}

export default ReportForm;