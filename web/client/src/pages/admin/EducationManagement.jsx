import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EducationPresenter from '../../presenters/EducationPresenter';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Form from '../../components/ui/Form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { EDUCATION_CATEGORIES } from '../../utils/constants';
import { isValidDate } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations.jsx';

function EducationManagement() {
    const [educations, setEducations] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        date: '',
        category: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const presenter = new EducationPresenter({
        setLoading: setIsLoading,
        showError: setError,
        showSuccess: setSuccess,
        setEducations,
        navigate,
    });

    useEffect(() => {
        presenter.getAllEducation();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content || !formData.date) {
            setError('Judul, konten, dan tanggal wajib diisi');
            return;
        }
        if (!isValidDate(formData.date)) {
            setError('Tanggal tidak valid');
            return;
        }
        await presenter.createEducation(formData);
        setFormData({ title: '', content: '', date: '', category: '' });
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
            await presenter.deleteEducation(id);
            presenter.getAllEducation();
        }
    };

    const headers = ['Judul', 'Kategori', 'Tanggal', 'Aksi'];

    const renderRow = (edu) => (
        <>
            <td className="px-4 py-2">{edu.title}</td>
            <td className="px-4 py-2">{edu.category || 'N/A'}</td>
            <td className="px-4 py-2">{new Date(edu.date).toLocaleDateString()}</td>
            <td className="px-4 py-2">
                <button
                    onClick={() => handleDelete(edu.id)}
                    className="text-red-500 hover:underline"
                >
                    Hapus
                </button>
            </td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="flex">
            <Sidebar role="admin" />
            <div className="flex-1 p-4 ml-64">
                <h1 className="text-2xl font-bold text-dark-green-900 mb-4">Manajemen Edukasi</h1>
                <ErrorMessage message={error} onClose={() => setError('')} />
                <SuccessMessage message={success} onClose={() => setSuccess('')} />
                {isLoading && <Spinner />}
                <Card title="Daftar Konten Edukasi">
                    <Button onClick={() => setIsModalOpen(true)} className="mb-4">
                        Tambah Konten
                    </Button>
                    <Table headers={headers} data={educations} renderRow={renderRow} />
                </Card>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Konten Edukasi">
                    <Form onSubmit={handleSubmit}>
                        <Input
                            label="Judul"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Konten"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Tanggal"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                        <div className="mb-4">
                            <label className="block text-dark-green-900 font-medium mb-1">Kategori</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-cream-200"
                            >
                                <option value="">Pilih Kategori</option>
                                {EDUCATION_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            Simpan
                        </Button>
                    </Form>
                </Modal>
            </div>
        </motion.div>
    );
}

export default EducationManagement;