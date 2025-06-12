import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { REPORT_TYPES, REPORT_STATUSES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function Dashboard({ isOfflineMode }) {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [modal, setModal] = useState({ isOpen: false, id: null, type: '' });
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
    setReports, // Pastikan setReports diteruskan
    navigate,
    refreshReports: () => {
      presenter.getUserReports({ type: filterType === '' ? undefined : filterType });
    },
  });

  useEffect(() => {
    presenter.getUserReports({ type: filterType === '' ? undefined : filterType });
  }, [filterType]);

  const handleDelete = (id, type) => {
    setModal({ isOpen: true, id, type });
  };

  const confirmDelete = async () => {
    const { id, type } = modal;
    if (type === REPORT_TYPES.WEB) {
      await presenter.deleteWebReport(id);
    } else {
      await presenter.deleteAppReport(id);
    }
    setModal({ isOpen: false, id: null, type: '' });
  };

  const headers = ['Tipe', 'Nama Aplikasi', 'Kategori', 'Tanggal', 'Status', 'Aksi'];

  const renderRow = (report) => [
    <td key="type" className="py-3 px-4"><Badge type={report.type} text={report.type === REPORT_TYPES.WEB ? 'Web' : 'App'} /></td>,
    <td key="appName" className="py-3 px-4">{report.appName}</td>,
    <td key="category" className="py-3 px-4">{report.category.join(', ')}</td>,
    <td key="incidentDate" className="py-3 px-4">{new Date(report.incidentDate).toLocaleDateString()}</td>,
    <td key="status" className="py-3 px-4">
      <Badge
        type={report.status?.toLowerCase() || 'pending'}
        text={REPORT_STATUSES[report.status?.toUpperCase()] || 'Menunggu'}
      />
    </td>,
    <td key="actions" className="py-3 px-4 flex space-x-2">
      <Button
        onClick={() => navigate(`/report/edit/${report.id}`)}
        className="bg-pinjol-dark-3 text-white text-sm"
      >
        <i className="fas fa-edit mr-2"></i> Edit
      </Button>
      <Button
        onClick={() => handleDelete(report.id, report.type)}
        className="bg-red-500 text-white hover:bg-red-400 text-sm"
      >
        <i className="fas fa-trash mr-2"></i> Hapus
      </Button>
    </td>,
  ];

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
            <i className="fas fa-tachometer-alt mr-3"></i> Dashboard Pengguna
          </motion.h1>
          {isOfflineMode && (
            <motion.p
              className="text-yellow-600 mb-4 flex items-center"
              variants={itemVariants}
            >
              <i className="fas fa-exclamation-triangle mr-2"></i> Mode offline: Laporan disimpan lokal dan akan disinkronkan saat online.
            </motion.p>
          )}
          <ErrorMessage message={error} onClose={() => setError('')} />
          {isLoading && <Spinner />}
          <Card title="Laporan Anda">
            <motion.div className="flex justify-between mb-6" variants={itemVariants}>
              <div className="flex items-center space-x-4">
                <label className="font-semibold text-pinjol-dark-2">Filter Tipe:</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-pinjol-light-4 rounded-lg px-3 py-2 bg-pinjol-light-2 focus:ring-2 focus:ring-pinjol-dark-3"
                >
                  <option value="">Semua</option>
                  <option value={REPORT_TYPES.WEB}>Web</option>
                  <option value={REPORT_TYPES.APP}>App</option>
                </select>
              </div>
              <Button
                onClick={() => navigate('/report/new')}
                className="bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2"
              >
                <i className="fas fa-plus mr-2"></i> Buat Laporan Baru
              </Button>
            </motion.div>
            <Table headers={headers} data={reports} renderRow={renderRow} />
          </Card>
        </motion.div>
      </FullScreenSection>
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, id: null, type: '' })}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message="Yakin ingin menghapus laporan ini?"
        confirmText="Hapus"
      />
    </div>
  );
}

export default Dashboard;