import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Form from '../../components/ui/Form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import { REPORT_CATEGORIES, REPORT_TYPES, EVIDENCE_PLACEHOLDER } from '../../utils/constants';
import { isValidDate, isValidUrl } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function ReportEdit({ isOfflineMode }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    appName: '',
    description: '',
    category: [],
    incidentDate: '',
    evidence: '',
    status: 'pending',
    type: REPORT_TYPES.WEB,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const presenter = new ReportPresenter({
    setLoading: setIsLoading,
    showError: (message) =>
      window.Swal.fire({
        icon: 'error',
        title: 'Peringatan',
        text: message,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      }),
    showSuccess: (message) =>
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: message,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      }),
    setReport: (report) =>
      setFormData({
        appName: report.appName || '',
        description: report.description || '',
        category: report.category || [],
        incidentDate: report.incidentDate ? new Date(report.incidentDate).toISOString().split('T')[0] : '',
        evidence: report.evidence || '',
        status: report.status || 'pending',
        type: report.type || REPORT_TYPES.WEB,
      }),
    navigate,
    refreshReports: () => presenter.getUserReports(),
  });

  useEffect(() => {
    presenter.getReportById(id, formData.type);
  }, [id, formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const options = e.target.options;
      const selected = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selected.push(options[i].value);
      }
      setFormData({ ...formData, [name]: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.appName || !formData.description || !formData.category.length || !formData.incidentDate) {
      setError('Semua field kecuali bukti wajib diisi');
      return;
    }
    if (!isValidDate(formData.incidentDate)) {
      setError('Tanggal kejadian tidak valid');
      return;
    }
    if (formData.evidence && !isValidUrl(formData.evidence)) {
      setError('Link bukti tidak valid');
      return;
    }
    window.Swal.fire({
      icon: 'warning',
      title: 'Konfirmasi Perbarui',
      text: 'Yakin ingin memperbarui laporan ini?',
      showCancelButton: true,
      confirmButtonText: 'Perbarui',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#658147',
      background: '#E7F0DC',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (formData.type === REPORT_TYPES.WEB) {
            await presenter.updateWebReport(id, formData);
          } else {
            await presenter.updateAppReport(id, formData);
          }
        } catch (error) {
          setError(error.message);
        }
      }
    });
  };

  const handleDelete = () => {
    window.Swal.fire({
      icon: 'warning',
      title: 'Konfirmasi Hapus',
      text: 'Yakin ingin menghapus laporan ini?',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#658147',
      background: '#E7F0DC',
    }).then((result) => {
      if (result.isConfirmed) {
        if (formData.type === REPORT_TYPES.WEB) {
          presenter.deleteWebReport(id);
        } else {
          presenter.deleteAppReport(id);
        }
      }
    });
  };

  return (
    <FullScreenSection>
      <motion.div {...pageTransition} className="container">
        <h1 className="text-2xl font-bold mb-4">Edit Laporan</h1>
        <ErrorMessage message={error} onClose={() => setError('')} />
        <SuccessMessage message={success} onClose={() => setSuccess('')} />
        {isLoading && <Spinner />}
        {isOfflineMode && (
          <p className="text-yellow-600 mb-4">Mode offline: Perubahan disimpan lokal dan akan disinkronkan saat online.</p>
        )}
        <Form onSubmit={handleSubmit}>
          <div className="input-group mb-4">
            <label className="block text-pgray-700 font-medium mb-1">
              Tipe Laporan
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-pinjol-light-4 rounded-lg"
              disabled
            >
              <option value={REPORT_TYPES.WEB}>Web</option>
              <option value={REPORT_TYPES.APP}>App</option>
            </select>
          </div>
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
          <div className="input-group mb-4">
            <label className="block text-pgray-700 font-medium mb-1">
              Kategori<span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              multiple
              required
              className="w-full px-3 py-2 border border-pinjol-light-4 rounded-lg"
            >
              {REPORT_CATEGORIES.map((cat) => {
                const [value, label] = cat.split(': ');
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
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
            label="Link Bukti (opsional)"
            name="evidence"
            type="url"
            value={formData.evidence}
            onChange={handleChange}
            placeholder={EVIDENCE_PLACEHOLDER}
          />
          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading} className="w-full bg-pinjol-dark-3 text-white">
              Simpan Perubahan
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full bg-red-500 text-white"
            >
              Hapus Laporan
            </Button>
          </div>
        </Form>
      </motion.div>
    </FullScreenSection>
  );
}

export default ReportEdit;
