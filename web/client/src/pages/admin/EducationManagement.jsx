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
import { itemVariants } from '../../utils/animations';

function EducationManagement() {
  const [educations, setEducations] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    content: '',
    date: '',
    category: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('Educations state updated:', educations);
  }, [educations]);

  const presenter = new EducationPresenter({
    setLoading: setIsLoading,
    showError: setError,
    showSuccess: setSuccess,
    setEducations,
    navigate,
  });

  useEffect(() => {
    if (token) {
      presenter.getAllEducation({}, token);
    } else {
      setError('Anda belum login. Silakan login terlebih dahulu.');
      navigate('/login');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.date) {
      setError('Judul, konten, dan tanggal wajib diisi');
      return;
    }
    if (!isValidDate(formData.date)) {
      setError('Tanggal tidak valid');
      return;
    }
    if (!token) {
      setError('Sesi telah berakhir. Silakan login kembali.');
      navigate('/login');
      return;
    }
    try {
      if (isEditMode) {
        await presenter.updateEducation(formData.id, {
          title: formData.title,
          content: formData.content,
          date: formData.date,
          category: formData.category,
        }, token);
      } else {
        await presenter.createEducation({
          title: formData.title,
          content: formData.content,
          date: formData.date,
          category: formData.category,
        }, token);
      }
      setFormData({ id: null, title: '', content: '', date: '', category: '' });
      setIsModalOpen(false);
      setIsEditMode(false);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan konten');
    }
  };

  const handleEdit = (edu) => {
    setFormData({
      id: edu.id,
      title: edu.title,
      content: edu.content,
      date: edu.date.split('T')[0],
      category: edu.category || '',
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!token) {
      setError('Sesi telah berakhir. Silakan login kembali.');
      navigate('/login');
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
      try {
        console.log('Initiating delete for ID:', id);
        await presenter.deleteEducation(id, token);
        console.log('Delete operation completed');
        // Solusi sementara: Hapus item dari state jika backend gagal
        setEducations((prev) => prev.filter((edu) => edu.id !== id));
      } catch (err) {
        console.error('Error in handleDelete:', err);
        setError(err.message || 'Gagal menghapus konten');
      }
    }
  };

  const openAddModal = () => {
    setFormData({ id: null, title: '', content: '', date: '', category: '' });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const headers = ['Judul', 'Kategori', 'Tanggal', 'Aksi'];

  const renderRow = (edu) => (
    <>
      <td className="py-4 px-6">{edu.title}</td>
      <td className="py-4 px-6">{edu.category || 'N/A'}</td>
      <td className="py-4 px-6">{new Date(edu.date).toLocaleDateString('id-ID')}</td>
      <td className="py-4 px-6 flex space-x-2">
        <Button
          onClick={() => handleEdit(edu)}
          className="bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2 px-3 py-1"
        >
          <i className="fas fa-edit mr-2"></i> Edit
        </Button>
        <Button
          onClick={() => handleDelete(edu.id)}
          className="bg-red-500 text-white hover:bg-red-600 px-3 py-1"
        >
          <i className="fas fa-trash mr-2"></i> Hapus
        </Button>
      </td>
    </>
  );

  return (
    <motion.div
      className="flex min-h-screen bg-pinjol-light-1 font-roboto"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <Sidebar role="admin" />
      <div className="flex-1 flex justify-center items-start py-6 overflow-x-hidden">
        <div className="container mx-auto max-w-6xl px-4 w-full">
          <h1 className="text-4xl font-bold text-pinjol-dark-3 mb-8 text-center">
            Manajemen Edukasi
          </h1>
          <ErrorMessage message={error} onClose={() => setError('')} />
          <SuccessMessage message={success} onClose={() => setSuccess('')} />
          {isLoading && <Spinner />}
          <Card title="Pratinjau Konten" className="mb-6">
            <p className="text-pinjol-dark-2 text-sm">
              Klik "Edit" untuk melihat pratinjau konten di modal, atau tambah konten baru dengan tombol di bawah.
            </p>
            <Button
              onClick={openAddModal}
              className="bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2 mt-4"
            >
              <i className="fas fa-plus mr-2"></i> Tambah Konten
            </Button>
          </Card>
          <Card title="Daftar Konten Edukasi">
            <Table headers={headers} data={educations} renderRow={renderRow} />
          </Card>
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setIsEditMode(false);
              setFormData({ id: null, title: '', content: '', date: '', category: '' });
            }}
            title={isEditMode ? 'Edit Konten Edukasi' : 'Tambah Konten Edukasi'}
          >
            <div className="max-w-4xl mx-auto px-4">
              <Form onSubmit={handleSubmit}>
                <Input
                  label="Judul"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
                <div className="mb-4">
                  <label className="block text-pinjol-dark-2 font-medium mb-1">
                    Konten<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-pinjol-light-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pinjol-dark-3"
                    rows="5"
                  ></textarea>
                </div>
                <Input
                  label="Tanggal"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
                <div className="input-group mb-4">
                  <label className="block text-pinjol-dark-2 font-medium mb-1">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-pinjol-light-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pinjol-dark-3"
                  >
                    <option value="">Pilih Kategori</option>
                    {EDUCATION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2 w-full"
                >
                  <i className="fas fa-save mr-2"></i> Simpan
                </Button>
              </Form>
            </div>
          </Modal>
        </div>
      </div>
    </motion.div>
  );
}

export default EducationManagement;