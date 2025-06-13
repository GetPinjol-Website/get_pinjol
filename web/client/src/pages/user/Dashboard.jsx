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
import Select from '../../components/common/Select';
import Sidebar from '../../components/layout/Sidebar';
import { REPORT_TYPES, REPORT_STATUSES, REPORT_LEVELS } from '../../utils/constants';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [modal, setModal] = useState({ isOpen: false, id: null, type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 25;
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
    setReports: (data) => setReports([...(data.data || data)]), // Menangani struktur data.data dari server
    navigate,
    refreshReports: () => {
      presenter.getUserReports({ type: filterType === '' ? undefined : filterType, _t: Date.now() });
      setCurrentPage(1);
    },
  });

  useEffect(() => {
    presenter.getUserReports({ type: filterType === '' ? undefined : filterType, _t: Date.now() });
  }, [filterType]);

  const handleDelete = async (id, type) => {
    setModal({ isOpen: true, id, type });
  };

  const confirmDelete = async () => {
    try {
      const { id, type } = modal;
      console.log('Initiating delete for ID:', id, 'Type:', type);
      if (type === REPORT_TYPES.WEB) {
        await presenter.deleteWebReport(id);
      } else {
        await presenter.deleteAppReport(id);
      }
      setReports((prev) => prev.filter((report) => report.id !== id));
      setModal({ isOpen: false, id: null, type: '' });
    } catch (err) {
      console.error('Error in confirmDelete:', err);
      setError(err.message || 'Gagal menghapus laporan');
    }
  };

  const headers = ['Tipe', 'Nama Aplikasi', 'Deskripsi', 'Kategori', 'Tanggal', 'Bukti', 'Tingkat', 'Status', 'Aksi'];

  const renderRow = (report) => {
    const level = report.level && Object.values(REPORT_LEVELS).includes(report.level) ? report.level : 'low';
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
      <td key="level" className="py-3 px-4"><Badge type={level} text={level.charAt(0).toUpperCase() + level.slice(1)} /></td>,
      <td key="status" className="py-3 px-4"><Badge type={report.status?.toLowerCase() || 'pending'} text={REPORT_STATUSES[report.status?.toUpperCase()] || 'Menunggu'} /></td>,
      <td key="actions" className="py-3 px-4 flex space-x-2">
        <Button onClick={() => navigate(`/report/edit/${report.id}`)} className="bg-pinjol-dark-3 text-white text-sm"><i className="fas fa-edit mr-2"></i> Edit</Button>
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
    <div className="flex bg-pinjol-light-1">
      <Sidebar role="user" />
      <div className="bg-pinjol-light-1 w-full">
        <FullScreenSection className="pt-20">
          <motion.div className="container mx-auto px-4" variants={itemVariants} initial="hidden" animate="visible">
            <motion.h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 flex items-center" variants={itemVariants}>
              <i className="fas fa-tachometer-alt mr-3"></i> Dashboard Pengguna
            </motion.h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {isLoading && <Spinner />}
            <Card title="Laporan Anda">
              <motion.div className="flex justify-between mb-6" variants={itemVariants}>
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
              </motion.div>
              <Table
                headers={headers}
                data={currentReports}
                renderRow={renderRow}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
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
    </div>
  );
}

export default Dashboard;