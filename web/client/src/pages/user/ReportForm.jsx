import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Form from '../../components/ui/Form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import DropdownChecklist from '../../components/common/DropdownChecklist';
import { REPORT_CATEGORIES, REPORT_TYPES, EVIDENCE_PLACEHOLDER } from '../../utils/constants';
import { isValidDate, isValidUrl } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function ReportForm({ isOfflineMode }) {
  const [formData, setFormData] = useState({
    appName: '',
    description: '',
    category: [],
    incidentDate: '',
    evidence: '',
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
    navigate,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.appName || !formData.description || !formData.category.length || !formData.incidentDate) {
      setError('Semua field kecuali bukti wajib diisi');
      window.Swal.fire({
        icon: 'error',
        title: 'Peringatan',
        text: 'Semua field kecuali bukti wajib diisi',
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      });
      return;
    }
    if (!isValidDate(formData.incidentDate)) {
      setError('Tanggal kejadian tidak valid');
      window.Swal.fire({
        icon: 'error',
        title: 'Peringatan',
        text: 'Tanggal kejadian tidak valid',
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      });
      return;
    }
    if (formData.evidence && !isValidUrl(formData.evidence)) {
      setError('Link bukti tidak valid');
      window.Swal.fire({
        icon: 'error',
        title: 'Peringatan',
        text: 'Link bukti tidak valid',
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      });
      return;
    }
    try {
      if (formData.type === REPORT_TYPES.WEB) {
        await presenter.createWebReport(formData);
      } else {
        await presenter.createAppReport(formData);
      }
    } catch (error) {
      setError(error.message);
      window.Swal.fire({
        icon: 'error',
        title: 'Peringatan',
        text: error.message,
        confirmButtonColor: '#658147',
        background: '#E7F0DC',
      });
    }
  };

  const categoryOptions = REPORT_CATEGORIES.map((cat) => {
    const [value, label] = cat.split(': ');
    return { value, label };
  });

  return (
    <FullScreenSection>
      <motion.div {...pageTransition} className="container">
        <h1 className="text-2xl font-bold mb-4">Buat Laporan</h1>
        <ErrorMessage message={error} onClose={() => setError('')} />
        <SuccessMessage message={success} onClose={() => setSuccess('')} />
        {isLoading && <Spinner />}
        {isOfflineMode && (
          <p className="text-yellow-600 mb-4">Mode offline: Laporan disimpan lokal dan akan disinkronkan saat online.</p>
        )}
        <Form onSubmit={handleSubmit}>
          <div className="input-group mb-4">
            <label className="block text-pgray-700 font-medium mb-1">
              Tipe Laporan<span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-pinjol-light-4 rounded-lg"
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
          <DropdownChecklist
            label="Kategori"
            name="category"
            options={categoryOptions}
            selected={formData.category}
            onChange={handleChange}
          />
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
          <Button type="submit" disabled={isLoading} className="bg-pinjol-dark-3 text-white">
            Kirim Laporan
          </Button>
        </Form>
      </motion.div>
    </FullScreenSection>
  );
}

export default ReportForm;