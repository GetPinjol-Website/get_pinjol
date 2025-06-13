import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import Form from '../../components/ui/Form';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import Card from '../../components/ui/Card';
import Sidebar from '../../components/layout/Sidebar';
import DropdownChecklist from '../../components/common/DropdownChecklist';
import UserModel from '../../models/UserModel';
import { REPORT_TYPES, REPORT_CATEGORIES, EVIDENCE_PLACEHOLDER } from '../../utils/constants';
import { isValidDate, isValidUrl } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function ReportForm() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const token = localStorage.getItem('token');

  const initialFormData = {
    appName: '',
    description: '',
    category: [],
    incidentDate: new Date().toISOString().split('T')[0],
    evidence: '',
    type: type || REPORT_TYPES.WEB,
    userId: UserModel.getUserId() || '',
  };

  const [formData, setFormData] = useState(initialFormData);
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
        appName: data.data?.appName || '',
        description: data.data?.description || '',
        category: Array.isArray(data.data?.category) ? data.data.category : [],
        incidentDate: data.data?.incidentDate
          ? new Date(data.data.incidentDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        evidence: data.data?.evidence || '',
        type: data.data?.type || type || REPORT_TYPES.WEB,
        userId: data.data?.userId || UserModel.getUserId() || '',
      });
    },
  });

  useEffect(() => {
    if (!token) {
      setError('Anda belum login. Silakan login terlebih dahulu.');
      navigate('/login');
      return;
    }

    if (isEdit && id) {
      presenter.getReportById(id, type || REPORT_TYPES.WEB, token);
    }
  }, [id, type, token, navigate, isEdit, presenter]);

  const validateForm = () => {
    const missingFields = [];
    if (!formData.appName.trim()) missingFields.push('Nama Aplikasi');
    if (!formData.description.trim()) missingFields.push('Deskripsi');
    if (!formData.incidentDate || !isValidDate(formData.incidentDate)) missingFields.push('Tanggal Kejadian');
    if (formData.evidence && !isValidUrl(formData.evidence)) missingFields.push('Link Bukti tidak valid');
    if (!formData.userId || !token) {
      navigate('/login');
      missingFields.push('ID Pengguna (silakan login ulang)');
    }
    return missingFields.length > 0 ? missingFields : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      category: Array.isArray(selected) ? selected : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingFields = validateForm();
    if (missingFields) {
      window.Swal.fire({
        icon: 'warning',
        title: 'Formulir Tidak Lengkap',
        html: `Field berikut wajib diisi atau tidak valid:<br><ul class="list-disc list-inside">${missingFields
          .map((field) => `<li>${field}</li>`)
          .join('')}</ul>`,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      });
      setError('Silakan lengkapi formulir');
      return;
    }

    try {
      setError('');
      const { type, category, ...dataToSend } = formData;
      // Only include category if it's non-empty
      if (category.length > 0) {
        dataToSend.category = category;
      }
      if (isEdit) {
        await presenter[formData.type === REPORT_TYPES.WEB ? 'updateWebReport' : 'updateAppReport'](
          id,
          dataToSend,
          token
        );
      } else {
        await presenter[formData.type === REPORT_TYPES.WEB ? 'createWebReport' : 'createAppReport'](
          dataToSend,
          token
        );
      }
      setFormData(initialFormData);
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
    <motion.div
      className="flex min-h-screen bg-pinjol-light-1 font-roboto"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <Sidebar role="user" />
      <div className="flex-1 flex justify-center items-start py-6 overflow-x-hidden">
        <div className="container mx-auto max-w-4xl px-4 w-full">
          <motion.h1
            className="text-3xl font-bold text-pinjol-dark-3 mb-6 text-center"
            variants={itemVariants}
          >
            {isEdit ? 'Edit Laporan' : 'Buat Laporan Baru'}
          </motion.h1>
          <ErrorMessage message={error} onClose={() => setError('')} />
          {isLoading && <Spinner />}
          <Card title={isEdit ? 'Form Edit Laporan' : 'Form Laporan Baru'} className="mb-6">
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
                  className="bg-pinjol-light-2"
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
                  rows="5"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DropdownChecklist
                  label="Kategori (opsional)"
                  name="category"
                  options={categoryOptions}
                  selected={formData.category}
                  onChange={handleCategoryChange}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Tanggal Kejadian"
                  name="incidentDate"
                  type="date"
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
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2 w-full"
                >
                  <i className="fas fa-save mr-2"></i>
                  {isEdit ? 'Perbarui Laporan' : 'Kirim Laporan'}
                </Button>
              </motion.div>
            </Form>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default ReportForm;