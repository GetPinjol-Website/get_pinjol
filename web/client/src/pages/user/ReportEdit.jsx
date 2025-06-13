import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import Form from '../../components/ui/Form';
import Card from '../../components/ui/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import DropdownChecklist from '../../components/common/DropdownChecklist';
import TextArea from '../../components/common/TextArea';
import Select from '../../components/common/Select';
import Sidebar from '../../components/layout/Sidebar';
import UserModel from '../../models/UserModel';
import { REPORT_CATEGORIES, REPORT_TYPES, EVIDENCE_PLACEHOLDER } from '../../utils/constants';
import { isValidDate, isValidUrl } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function ReportEdit() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    appName: '',
    description: '',
    category: [],
    incidentDate: new Date().toISOString().split('T')[0],
    evidence: '',
    type: type || REPORT_TYPES.WEB,
    userId: UserModel.getUserId() || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const presenter = new ReportPresenter({
    setLoading: setIsLoading,
    showError: setError,
    showSuccess: setSuccess,
    setReport: (report) => {
      setFormData({
        appName: report.data?.appName || '',
        description: report.data?.description || '',
        category: Array.isArray(report.data?.category) ? report.data.category : [],
        incidentDate: report.data?.incidentDate ? new Date(report.data.incidentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        evidence: report.data?.evidence || '',
        type: report.data?.type || type || REPORT_TYPES.WEB,
        userId: report.data?.userId || UserModel.getUserId() || '',
      });
    },
    navigate,
    refreshReports: () => presenter.getUserReports({ _t: Date.now() }),
  });

  useEffect(() => {
    if (!token) {
      setError('Anda belum login. Silakan login terlebih dahulu.');
      navigate('/login');
      return;
    }
    if (id) {
      presenter.getReportById(id, formData.type, { _t: Date.now() }, token);
    }
  }, [id, formData.type, token]);

  const validateForm = () => {
    if (!formData.appName.trim()) return 'Nama aplikasi wajib diisi';
    if (!formData.description.trim()) return 'Deskripsi wajib diisi';
    if (!Array.isArray(formData.category) || formData.category.length === 0) return 'Pilih setidaknya satu kategori';
    const validCategories = REPORT_CATEGORIES.map((cat) => cat.split(': ')[0]);
    if (!formData.category.every((cat) => validCategories.includes(cat))) return 'Kategori tidak valid';
    if (!formData.incidentDate || !isValidDate(formData.incidentDate)) return 'Tanggal kejadian tidak valid';
    if (formData.evidence && !isValidUrl(formData.evidence)) return 'Link bukti tidak valid';
    if (!formData.userId) return 'ID pengguna tidak tersedia, silakan login ulang';
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (selected) => {
    setFormData({ ...formData, category: Array.isArray(selected) ? selected : [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Sesi telah berakhir. Silakan login kembali.');
      navigate('/login');
      return;
    }
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setError('');
      const { type, ...dataToSend } = formData;
      if (formData.type === REPORT_TYPES.WEB) {
        await presenter.updateWebReport(id, dataToSend, token);
      } else {
        await presenter.updateAppReport(id, dataToSend, token);
      }
      setSuccess('Laporan berhasil diperbarui');
      presenter.refreshReports();
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Gagal memperbarui laporan');
    }
  };

  const handleDelete = async () => {
    if (!token) {
      setError('Sesi telah berakhir. Silakan login kembali.');
      navigate('/login');
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        if (formData.type === REPORT_TYPES.WEB) {
          await presenter.deleteWebReport(id, token);
        } else {
          await presenter.deleteAppReport(id, token);
        }
        setSuccess('Laporan berhasil dihapus');
        navigate('/dashboard');
      } catch (err) {
        console.error('Error in handleDelete:', err);
        setError(err.message || 'Gagal menghapus laporan');
      }
    }
  };

  const categoryOptions = REPORT_CATEGORIES.map((cat) => {
    const [value, label] = cat.split(': ');
    return { value, label };
  });

  return (
    <motion.div
      className="flex min-h-screen bg-pinjol-light-1 font-roboto"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <Sidebar role="user" />
      <div className="flex-1 flex justify-center items-start py-6 overflow-x-hidden">
        <div className="container mx-auto max-w-4xl px-4 w-full">
          <h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 text-center">
            Edit Laporan
          </h1>
          <ErrorMessage message={error} onClose={() => setError('')} />
          <SuccessMessage message={success} onClose={() => setSuccess('')} />
          {isLoading && <Spinner />}
          <Card title="Form Edit Laporan">
            <Form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Tipe Laporan"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { value: REPORT_TYPES.WEB, label: 'Web' },
                  { value: REPORT_TYPES.APP, label: 'Aplikasi' },
                ]}
                required
                disabled
              />
              <Input
                label="Nama Aplikasi/Web"
                name="appName"
                value={formData.appName}
                onChange={handleChange}
                required
                className="bg-pinjol-light-2"
              />
              <TextArea
                label="Deskripsi Keluhan"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="bg-pinjol-light-2"
              />
              <DropdownChecklist
                label="Kategori"
                name="category"
                options={categoryOptions}
                selected={formData.category}
                onChange={handleCategoryChange}
                required
              />
              <Input
                label="Tanggal Kejadian"
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                required
                className="bg-pinjol-light-2"
              />
              <Input
                label="Link Bukti (opsional)"
                name="evidence"
                value={formData.evidence}
                onChange={handleChange}
                placeholder={EVIDENCE_PLACEHOLDER}
                className="bg-pinjol-light-2"
              />
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2"
                >
                  <i className="fas fa-save mr-2"></i> Simpan Perubahan
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white hover:bg-red-500"
                >
                  <i className="fas fa-trash mr-2"></i> Hapus Laporan
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default ReportEdit;