import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import Card from '../../components/ui/Card';
import Sidebar from '../../components/layout/Sidebar';
import DropdownChecklist from '../../components/common/DropdownChecklist';
import { REPORT_TYPES, REPORT_CATEGORIES, EVIDENCE_PLACEHOLDER } from '../../utils/constants';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function ReportForm() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    appName: '',
    description: '',
    category: [],
    incidentDate: '',
    evidence: '',
    type: type || REPORT_TYPES.WEB,
    level: 'low',
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
    navigate,
    setReport: (data) => {
      setFormData({
        appName: data.appName || '',
        description: data.description || '',
        category: Array.isArray(data.category) ? data.category : [],
        incidentDate: data.incidentDate ? new Date(data.incidentDate).toISOString().split('T')[0] : '',
        evidence: data.evidence || '',
        type: data.type || REPORT_TYPES.WEB,
        level: data.level || 'low',
      });
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      presenter.getReportById(id, formData.type);
    }
  }, [id, formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selected) => {
    console.log('Selected categories:', selected); // Logging untuk debug
    setFormData({ ...formData, category: Array.isArray(selected) ? selected : [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const data = {
        ...formData,
        category: Array.isArray(formData.category) ? formData.category : [], // Pastikan category adalah array
        incidentDate: formData.incidentDate || new Date().toISOString().split('T')[0], // Default ke tanggal hari ini jika kosong
      };
      console.log('Submitting data:', data); // Logging untuk debug
      if (isEdit) {
        await presenter[formData.type === REPORT_TYPES.WEB ? 'updateWebReport' : 'updateAppReport'](id, data);
      } else {
        await presenter[formData.type === REPORT_TYPES.WEB ? 'createWebReport' : 'createAppReport'](data);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Gagal menyimpan laporan');
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
          <motion.h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6" variants={itemVariants}>
            {isEdit ? 'Edit Laporan' : 'Buat Laporan Baru'}
          </motion.h1>
          <ErrorMessage message={error} onClose={() => setError('')} />
          {isLoading && <Spinner />}
          <Card title={isEdit ? 'Form Edit Laporan' : 'Form Laporan Baru'}>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              />
              <Input
                label="Nama Aplikasi/Web"
                name="appName"
                value={formData.appName}
                onChange={handleChange}
                required
              />
              <TextArea
                label="Deskripsi Keluhan"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
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
                name="incidentDate"
                type="date"
                value={formData.incidentDate}
                onChange={handleChange}
                required
              />
              <Input
                label="Link Bukti (opsional)"
                name="evidence"
                value={formData.evidence}
                onChange={handleChange}
                placeholder={EVIDENCE_PLACEHOLDER}
              />
              <Button type="submit" className="bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2">
                {isEdit ? 'Perbarui Laporan' : 'Kirim Laporan'}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ReportForm;