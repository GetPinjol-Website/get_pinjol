import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Form from '../../components/ui/Form';
import Card from '../../components/ui/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import DropdownChecklist from '../../components/common/DropdownChecklist';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import TextArea from '../../components/common/TextArea';
import Select from '../../components/common/Select';
import Sidebar from '../../components/layout/Sidebar';
import { REPORT_CATEGORIES, REPORT_TYPES, EVIDENCE_PLACEHOLDER } from '../../utils/constants';
import { isValidDate, isValidUrl } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function ReportEdit() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    appName: '',
    description: '',
    category: [],
    incidentDate: '',
    evidence: '',
    type: REPORT_TYPES.WEB,
    level: 'low',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false });
  const navigate = useNavigate();

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
    setReport: (report) =>
      setFormData({
        appName: report.appName || '',
        description: report.description || '',
        category: Array.isArray(report.category) ? report.category : [],
        incidentDate: report.incidentDate ? new Date(report.incidentDate).toISOString().split('T')[0] : '',
        evidence: report.evidence || '',
        type: report.type || REPORT_TYPES.WEB,
      }),
    navigate,
    refreshReports: () => presenter.getUserReports({ _t: Date.now() }),
  });

  useEffect(() => {
    presenter.getReportById(id, formData.type, { _t: Date.now() });
  }, [id, formData.type]);

  const validateForm = () => {
    if (!formData.appName) return 'Nama aplikasi wajib diisi';
    if (!formData.description) return 'Deskripsi wajib diisi';
    if (!formData.category.length) return 'Pilih setidaknya satu kategori';
    if (!formData.incidentDate || !isValidDate(formData.incidentDate)) return 'Tanggal kejadian tidak valid';
    if (formData.evidence && !isValidUrl(formData.evidence)) return 'Link bukti tidak valid';
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (selected) => {
    setFormData({ ...formData, category: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      console.log('Submitting update for ID:', id, 'Type:', formData.type);
      if (formData.type === REPORT_TYPES.WEB) {
        await presenter.updateWebReport(id, formData);
      } else {
        await presenter.updateAppReport(id, formData);
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Gagal memperbarui laporan');
    }
  };

  const handleDelete = () => {
    setModal({ isOpen: true });
  };

  const confirmDelete = async () => {
    try {
      console.log('Initiating delete for ID:', id, 'Type:', formData.type);
      if (formData.type === REPORT_TYPES.WEB) {
        await presenter.deleteWebReport(id);
      } else {
        await presenter.deleteAppReport(id);
      }
      setModal({ isOpen: false });
    } catch (err) {
      console.error('Error in confirmDelete:', err);
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
        <FullScreenSection className="pt-20">
          <motion.div className="container mx-auto px-4" variants={itemVariants} initial="hidden" animate="visible">
            <motion.h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 flex items-center" variants={itemVariants}>
              <i className="fas fa-edit mr-3"></i> Edit Laporan
            </motion.h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {isLoading && <Spinner />}
            <Card>
              <Form onSubmit={handleSubmit}>
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
                  <Input label="Nama Aplikasi" name="appName" value={formData.appName} onChange={handleChange} required className="bg-pinjol-light-2" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <TextArea label="Deskripsi" name="description" value={formData.description} onChange={handleChange} required className="bg-pinjol-light-2" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <DropdownChecklist label="Kategori" name="category" options={categoryOptions} selected={formData.category} onChange={handleCategoryChange} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Input label="Tanggal Kejadian" type="date" name="incidentDate" value={formData.incidentDate} onChange={handleChange} required className="bg-pinjol-light-2" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Input label="Link Bukti (opsional)" name="evidence" type="url" value={formData.evidence} onChange={handleChange} placeholder={EVIDENCE_PLACEHOLDER} className="bg-pinjol-light-2" />
                </motion.div>
                <motion.div className="flex space-x-4" variants={itemVariants}>
                  <Button type="submit" disabled={isLoading} className="w-full bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2"><i className="fas fa-save mr-2"></i> Simpan Perubahan</Button>
                  <Button onClick={handleDelete} disabled={isLoading} className="w-full bg-red-600 text-white hover:bg-red-500"><i className="fas fa-trash mr-2"></i> Hapus Laporan</Button>
                </motion.div>
              </Form>
            </Card>
          </motion.div>
        </FullScreenSection>
        <ConfirmationModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ isOpen: false })}
          onConfirm={confirmDelete}
          title="Konfirmasi Hapus"
          message="Yakin ingin menghapus laporan ini?"
          confirmText="Hapus"
        />
      </div>
    </div>
  );
}

export default ReportEdit;