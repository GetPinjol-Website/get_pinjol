import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Form from '../../components/ui/Form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import DropdownChecklist from '../../components/common/DropdownChecklist';
import { REPORT_CATEGORIES, REPORT_TYPES, EVIDENCE_PLACEHOLDER } from '../../utils/constants';
import { isValidDate, isValidUrl } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

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
  const [isLoading, setIsLoading] = useState(false);
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
    navigate,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.type === REPORT_TYPES.WEB) {
        await presenter.createWebReport(formData);
      } else {
        await presenter.createAppReport(formData);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const categoryOptions = REPORT_CATEGORIES.map((cat) => {
    const [value, label] = cat.split(': ');
    return { value, label };
  });

  return (
    <div className="bg-pinjol-light-1">
      <FullScreenSection className="pt-20">
        <motion.div
          className="container mx-auto px-4"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl font-bold text-pinjol-dark-3 mb-6 flex items-center"
            variants={itemVariants}
          >
            <i className="fas fa-file-plus mr-3"></i> Buat Laporan
          </motion.h1>
          {isOfflineMode && (
            <motion.p
              className="text-yellow-600 mb-6 flex items-center"
              variants={itemVariants}
            >
              <i className="fas fa-exclamation-circle mr-2"></i> Mode offline: Laporan disimpan lokal dan akan disinkronkan saat online.
            </motion.p>
          )}
          <ErrorMessage message={error} onClose={() => setError('')} />
          {isLoading && <Spinner />}
          <Card>
            <Form onSubmit={handleSubmit}>
              <motion.div variants={itemVariants}>
                <div className="input-group mb-4">
                  <label className="block text-pinjol-dark-2 font-semibold mb-1">
                    Tipe Laporan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-pinjol-light-4 rounded-lg bg-pinjol-light-2 focus:ring-2 focus:ring-pinjol-dark-3"
                  >
                    <option value={REPORT_TYPES.WEB}>Web</option>
                    <option value={REPORT_TYPES.APP}>App</option>
                  </select>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Nama Aplikasi"
                  name="appName"
                  value={formData.appName}
                  onChange={handleChange}
                  required
                  className="bg-pinjol-light-2"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Deskripsi"
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
                  onChange={handleChange}
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
                  type="url"
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
                  className="w-full bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2"
                >
                  <i className="fas fa-paper-plane mr-2"></i> Kirim Laporan
                </Button>
              </motion.div>
            </Form>
          </Card>
        </motion.div>
      </FullScreenSection>
    </div>
  );
}

export default ReportForm;