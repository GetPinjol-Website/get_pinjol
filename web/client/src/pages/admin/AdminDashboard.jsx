import { useState, useEffect } from 'react';
import AdminPresenter from '../../presenters/AdminPresenter';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import Sidebar from '../../components/layout/Sidebar';
import Badge from '../../components/common/Badge';
import { motion } from 'framer-motion';
import { pageTransition, itemVariants } from '../../utils/animations';
import { useNavigate } from 'react-router-dom';
import { REPORT_TYPES, REPORT_STATUSES, REPORT_LEVELS } from '../../utils/constants';

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    setReports: (data) => setReports([...data]), // Pastikan referensi baru
    refreshReports: () => presenter.getAllReports({ _t: Date.now() }),
  });

  useEffect(() => {
    presenter.getAllReports({ _t: Date.now() });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const headers = ['Tipe', 'Nama Aplikasi', 'Kategori', 'Tanggal Kejadian', 'Tipe Laporan', 'Tingkat', 'Status'];

  const renderRow = (report) => {
    const level = report.level && Object.values(REPORT_LEVELS).includes(report.level) ? report.level : 'low';
    const category = Array.isArray(report.category) ? report.category : [];

    return [
      <td key="type" className="py-3 px-4"><Badge type={report.type} text={report.type === REPORT_TYPES.WEB ? 'Web' : 'App'} /></td>,
      <td key="appName" className="py-3 px-4">{report.appName}</td>,
      <td key="category" className="py-3 px-4">{category.join(', ') || '-'}</td>,
      <td key="incidentDate" className="py-3 px-4">{new Date(report.incidentDate).toLocaleDateString()}</td>,
      <td key="reportType" className="py-3 px-4"><Badge type={report.reportType} text={report.reportType === 'positive' ? 'Positif' : 'Negatif'} /></td>,
      <td key="level" className="py-3 px-4"><Badge type={level} text={level.charAt(0).toUpperCase() + level.slice(1)} /></td>,
      <td key="status" className="py-3 px-4">
        <Badge
          type={report.status?.toLowerCase() || 'pending'}
          text={REPORT_STATUSES[report.status?.toUpperCase()] || 'Menunggu'}
        />
      </td>,
    ];
  };

  return (
    <div className="flex bg-pinjol-light-1">
      <Sidebar role="admin" onLogout={handleLogout} />
      <motion.div {...pageTransition} className="content-with-sidebar pt-20 w-flex-1">
        <motion.div className="container mx-auto px-4" variants={itemVariants} initial="hidden" animate="visible">
          <motion.h1
            className="text-3xl font-bold text-pinjol-dark-3 mb-6 flex items-center"
            variants={itemVariants}
          >
            <i className="fas fa-tachometer-alt mr-3"></i> Dashboard Admin
          </motion.h1>
          <ErrorMessage message={error} onClose={() => setError('')} />
          {isLoading && <Spinner />}
          <Card title="Ringkasan Laporan">
            <Table headers={headers} data={reports} renderRow={renderRow} />
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;