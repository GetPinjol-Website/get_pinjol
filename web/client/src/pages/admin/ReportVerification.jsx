import { useState, useEffect } from 'react';
import AdminPresenter from '../../presenters/AdminPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import Sidebar from '../../components/layout/Sidebar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { REPORT_TYPES, REPORT_STATUSES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function ReportVerification({ isOfflineMode }) {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [modal, setModal] = useState({ isOpen: false, id: null, status: '', type: '' });

  const presenter = new AdminPresenter({
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
  });

  useEffect(() => {
    presenter.getAllReports({ type: filterType });
  }, [filterType]);

  const handleVerify = (id, status, type) => {
    setModal({
      isOpen: true,
      id,
      status,
      type,
    });
  };

  const confirmVerify = async () => {
    const { id, status, type } = modal;
    await presenter.verifyReport(id, { status: status === 'Diterima' ? 'accepted' : 'rejected' }, type);
    setModal({ isOpen: false, id: null, status: '', type: '' });
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
        onClick={() => handleVerify(report.id, 'Diterima', report.type)}
        className="bg-green-600 text-white hover:bg-green-500 text-sm"
      >
        <i className="fas fa-check mr-2"></i> Terima
      </Button>
      <Button
        onClick={() => handleVerify(report.id, 'Ditolak', report.type)}
        className="bg-red-500 text-white hover:bg-red-400 text-sm"
      >
        <i className="fas fa-times mr-2"></i> Tolak
      </Button>
    </td>,
  ];

  return (
    <div className="flex bg-pinjol-light-1">
      <Sidebar role="admin" />
      <div className="bg-pinjol-light-1 w-full">
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
              <i className="fas fa-check-circle mr-3"></i> Verifikasi Laporan
            </motion.h1>
            {isOfflineMode && (
              <motion.p
                className="text-yellow-600 mb-4 flex items-center"
                variants={itemVariants}
              >
                <i className="fas fa-exclamation-triangle mr-2"></i> Mode offline: Hanya menampilkan laporan lokal.
              </motion.p>
            )}
            <ErrorMessage message={error} onClose={() => setError('')} />
            {isLoading && <Spinner />}
            <Card title="Daftar Laporan">
              <motion.div className="flex mb-4" variants={itemVariants}>
                <div className="flex items-center space-x-2">
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
              </motion.div>
              <Table headers={headers} data={reports} renderRow={renderRow} />
            </Card>
          </motion.div>
        </FullScreenSection>
      </div>
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, id: null, status: '', type: '' })}
        onConfirm={confirmVerify}
        title={`Konfirmasi ${modal.status}`}
        message={`Yakin ingin ${modal.status.toLowerCase()} laporan ini?`}
        confirmText={modal.status}
      />
    </div>
  );
}

export default ReportVerification;