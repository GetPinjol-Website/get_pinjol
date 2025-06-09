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
import Sidebar from '../../components/layout/Sidebar';
import { EDUCATION_CATEGORIES } from '../../utils/constants';
import { isValidDate } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

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
            <td>{edu.title}</td>
            <td>{edu.category || 'N/A'}</td>
            <td>{new Date(edu.date).toLocaleDateString()}</td>
            <td>
                <Button
                    onClick={() => handleDelete(edu.id)}
                    className="btn-danger"
                >
                    Hapus
                </Button>
            </td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="flex">
            <Sidebar role="admin" />
            <div className="content-with-sidebar">
                <h1>Manajemen Edukasi</h1>
                <ErrorMessage message={error} onClose={() => setError('')} />
                <SuccessMessage message={success} onClose={() => setSuccess('')} />
                {isLoading && <Spinner />}
                <Card title="Daftarkan Konten Edukasi">
                    <Button onClick={() => setIsModalOpen(true)}>
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
                        <div className="input-group">
                            <label>Kategori</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
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