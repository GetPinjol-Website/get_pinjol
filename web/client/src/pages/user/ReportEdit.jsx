import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import Form from '../../components/ui/Form';
import Card from '../../components/ui/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
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
  const [isLoading, setIsLoading] = useState(false);

  const presenter = new ReportPresenter({
    setLoading: setIsLoading,
    showError: setError,
    showSuccess: (message) => {
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: message,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      });
    },
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
    if (id) {
      presenter.getReportById(id, formData.type, { _t: Date.now() });
    }
  }, [id, formData.type]);

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
    console.log('Selected categories:', selected);
    setFormData({ ...formData, category: Array.isArray(selected) ? selected : [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setError('');
      const { type, ...dataToSend } = formData;
      console.log('Submitting update for ID:', id, 'Type:', formData.type, 'Data:', dataToSend);
      if (formData.type === REPORT_TYPES.WEB) {
        await presenter.updateWebReport(id, dataToSend);
      } else {
        await presenter.updateAppReport(id, dataToSend);
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Gagal memperbarui laporan');
    }
  };

  const handleDelete = async () => {
    try {
      console.log('Initiating delete for ID:', id, 'Type:', formData.type);
      if (formData.type === REPORT_TYPES.WEB) {
        await presenter.deleteWebReport(id);
      } else {
        await presenter.deleteAppReport(id);
      }
    } catch (err) {
      console.error('Error in handleDelete:', err);
      setError(err.message || 'Gagal menghapus laporan');
    }
  };

  const categoryOptions = REPORT_CATEGORIES.map((cat) => {
    const [value, label] = cat.split(': ');
    return { value, label };
  });

  return (
    <div className="flex bg-pinjol-light-1">
      <Sidebar role="user" />
      <div className="bg-pinjol-light-1 w-full">
        <motion.div className="container mx-auto px-4 py-8" variants={itemVariants} initial="hidden" animate="visible">
          <motion.h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 flex items-center" variants={itemVariants}>
            <i className="fas fa-edit mr-3"></i> Edit Laporan
          </motion.h1>
          <ErrorMessage message={error} onClose={() => setError('')} />
          {isLoading && <Spinner />}
          <Card title="Form Edit Laporan">
            <Form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
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
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Nama Aplikasi/Web"
                  name="appName"
                  value={formData.appName}
                  onChange={handleChange}
                  required
                  className="bg-pinjol-light-2"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <TextArea
                  label="Deskripsi Keluhan"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="bg-pinjol-light-2"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DropdownChecklist
                  label="Kategori"
                  name="category"
                  options={categoryOptions}
                  selected={formData.category}
                  onChange={handleCategoryChange}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Tanggal Kejadian"
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  required
                  className="bg-pinjol-light-2"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Link Bukti (opsional)"
                  name="evidence"
                  value={formData.evidence}
                  onChange={handleChange}
                  placeholder={EVIDENCE_PLACEHOLDER}
                  className="bg-pinjol-light-2"
                />
              </motion.div>
              <motion.div className="flex space-x-4" variants={itemVariants}>
                <Button type="submit" disabled={isLoading} className="w-full bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2">
                  <i className="fas fa-save mr-2"></i> Simpan Perubahan
                </Button>
                <Button onClick={handleDelete} disabled={isLoading} className="w-full bg-red-600 text-white hover:bg-red-500">
                  <i className="fas fa-trash mr-2"></i> Hapus Laporan
                </Button>
              </motion.div>
            </Form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ReportEdit;