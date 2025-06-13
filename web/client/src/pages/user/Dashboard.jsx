import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Select from '../../components/common/Select';
import Sidebar from '../../components/layout/Sidebar';
import { REPORT_TYPES, REPORT_STATUSES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [modal, setModal] = useState({ isOpen: false, id: null, type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 25;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const presenter = new ReportPresenter({
    setLoading: setIsLoading,
    showError: setError,
    showSuccess: setSuccess,
    setReports: (data) => setReports([...(data.data || [])]),
    navigate,
    refreshReports: () => {
      presenter.getUserReports({ type: filterType || undefined, _t: Date.now() }, token);
      setCurrentPage(1);
    },
  });

  useEffect(() => {
    if (!token) {
      setError('Anda belum login. Silakan login terlebih dahulu.');
      navigate('/login');
      return;
    }
    presenter.getUserReports({ type: filterType || undefined, _t: Date.now() }, token);
  }, [filterType, token]);

  const handleDelete = async (id, type) => {
    if (!token) {
      setError('Sesi telah berakhir. Silakan login kembali.');
      navigate('/login');
      return;
    }
    setModal({ isOpen: true, id, type });
  };

  const confirmDelete = async () => {
    if (!token) {
      setError('Sesi telah berakhir. Silakan login kembali.');
      navigate('/login');
      return;
    }
    try {
      const { id, type } = modal;
      if (type === REPORT_TYPES.WEB) {
        await presenter.deleteWebReport(id, token);
      } else if (type === REPORT_TYPES.APP) {
        await presenter.deleteAppReport(id, token);
      }
      setReports((prev) => prev.filter((report) => report.id !== id));
      setSuccess('Laporan berhasil dihapus');
      setModal({ isOpen: false, id: null, type: '' });
      presenter.refreshReports();
    } catch (err) {
      console.error('Error in confirmDelete:', err);
      setError(err.message || 'Gagal menghapus laporan');
    }
  };

  const headers = ['Tipe', 'Nama Aplikasi', 'Deskripsi', 'Kategori', 'Tanggal', 'Bukti', 'Status', 'Aksi'];

  const renderRow = (report) => {
    const category = Array.isArray(report.category) ? report.category : [];
    return [
      <td key="type" className="py-3 px-4"><Badge type={report.type} text={report.type === REPORT_TYPES.WEB ? 'Web' : 'App'} /></td>,
      <td key="appName" className="py-3 px-4">{report.appName || '-'}</td>,
      <td key="description" className="py-3 px-4 max-w-xs truncate">{report.description || '-'}</td>,
      <td key="category" className="py-3 px-4">{category.join(', ') || '-'}</td>,
      <td key="incidentDate" className="py-3 px-4">{report.incidentDate ? new Date(report.incidentDate).toLocaleDateString() : '-'}</td>,
      <td key="evidence" className="py-3 px-4">
        {report.evidence ? <a href={report.evidence} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat</a> : '-'}
      </td>,
      <td key="status" className="py-3 px-4"><Badge type={report.status?.toLowerCase() || 'pending'} text={REPORT_STATUSES[report.status?.toUpperCase()] || 'Menunggu'} /></td>,
      <td key="actions" className="py-3 px-4 flex space-x-2">
        <Button onClick={() => navigate(`/report/edit/${report.id}/${report.type}`)} className="bg-pinjol-dark-3 text-white text-sm"><i className="fas fa-edit mr-2"></i> Edit</Button>
        <Button onClick={() => handleDelete(report.id, report.type)} className="bg-red-500 text-white hover:bg-red-400 text-sm"><i className="fas fa-trash mr-2"></i> Hapus</Button>
      </td>,
    ];
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <motion.div
      className="flex min-h-screen bg-pinjol-light-1 font-roboto"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <Sidebar role="user" />
      <div className="flex-1 flex justify-center items-start py-6 overflow-x-hidden">
        <div className="container mx-auto max-w-6xl px-4 w-full">
          <h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 text-center">
            Dashboard Pengguna
          </h1>
          <ErrorMessage message={error} onClose={() => setError('')} />
          <SuccessMessage message={success} onClose={() => setSuccess('')} />
          {isLoading && <Spinner />}
          <Card title="Laporan Anda">
            <div className="flex justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Select
                  label="Filter Tipe"
                  name="filterType"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  options={[
                    { value: '', label: 'Semua' },
                    { value: REPORT_TYPES.WEB, label: 'Web' },
                    { value: REPORT_TYPES.APP, label: 'Aplikasi' },
                  ]}
                />
              </div>
              <Button onClick={() => navigate('/report/new')} className="bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2"><i className="fas fa-plus mr-2"></i> Buat Laporan Baru</Button>
            </div>
            <Table
              headers={headers}
              data={currentReports}
              renderRow={renderRow}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </Card>
        </div>
      </div>
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, id: null, type: '' })}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message="Yakin ingin menghapus laporan ini?"
        confirmText="Hapus"
      />
    </motion.div>
  );
}

export default Dashboard;