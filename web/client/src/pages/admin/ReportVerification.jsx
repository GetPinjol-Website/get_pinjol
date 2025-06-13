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
import Sidebar from '../../components/layout/Sidebar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import UserModel from '../../models/UserModel';
import { REPORT_TYPES, REPORT_STATUSES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function ReportVerification() {
  const [reports, setReports] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [modal, setModal] = useState({ isOpen: false, id: null, status: '', type: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const presenter = new ReportPresenter({
    setLoading: setIsLoading,
    showError: setError,
    showSuccess: setSuccess,
    setReports: (data) => {
      const reportData = data.data || [];
      setReports([...reportData]);
      const userIds = [...new Set(reportData.map((report) => report.userId))];
      fetchUserNames(userIds);
    },
    refreshReports: () => presenter.getAllReports({ type: filterType || undefined, _t: Date.now() }, token),
    navigate,
  });

  const fetchUserNames = async (userIds) => {
    try {
      const newUserNames = { ...userNames };
      for (const userId of userIds) {
        if (!newUserNames[userId]) {
          const user = await UserModel.getUserById(userId, token);
          newUserNames[userId] = user.username || 'Tidak Diketahui';
        }
      }
      setUserNames(newUserNames);
    } catch (err) {
      console.error('Error fetching user names:', err);
      setError('Gagal mengambil data pengguna');
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Anda belum login. Silakan login terlebih dahulu.');
      navigate('/login');
      return;
    }
    presenter.getAllReports({ type: filterType || undefined, _t: Date.now() }, token);
  }, [filterType, token]);

  const handleVerify = (id, status, type) => {
    if (!token) {
      setError('Sesi telah berakhir. Silakan login kembali.');
      navigate('/login');
      return;
    }
    if (!type || ![REPORT_TYPES.WEB, REPORT_TYPES.APP].includes(type)) {
      setError('Tipe laporan tidak valid');
      return;
    }
    setModal({ isOpen: true, id, status, type });
  };

  const confirmVerify = async () => {
    if (!token) {
      setError('Sesi telah berakhir. Silakan login kembali.');
      navigate('/login');
      return;
    }
    try {
      const { id, status, type } = modal;
      await presenter.verifyReport(id, { status }, type, token);
      setReports((prev) =>
        prev.map((report) =>
          report.id === id ? { ...report, status: status.toUpperCase() } : report
        )
      );
      setSuccess(`Laporan berhasil ${status === 'accepted' ? 'diterima' : 'ditolak'}`);
      setModal({ isOpen: false, id: null, status: '', type: '' });
      presenter.refreshReports();
    } catch (err) {
      console.error('Error in confirmVerify:', err);
      setError(err.message || 'Gagal memverifikasi laporan');
    }
  };

  const headers = ['Tipe', 'Nama Pengguna', 'Nama Aplikasi', 'Deskripsi', 'Kategori', 'Tanggal', 'Bukti', 'Status', 'Aksi'];

  const renderRow = (report) => {
    const type = report.type || 'unknown';
    const username = userNames[report.userId] || 'Memuat...';
    return [
      <td key="type" className="py-3 px-4"><Badge type={type} text={type === REPORT_TYPES.WEB ? 'Web' : type === REPORT_TYPES.APP ? 'App' : 'Tidak Diketahui'} /></td>,
      <td key="username" className="py-3 px-4">{username}</td>,
      <td key="appName" className="py-3 px-4">{report.appName || '-'}</td>,
      <td key="description" className="py-3 px-4">{report.description || '-'}</td>,
      <td key="category" className="py-3 px-4">{(Array.isArray(report.category) ? report.category.join(', ') : '-')}</td>,
      <td key="incidentDate" className="py-3 px-4">{report.incidentDate ? new Date(report.incidentDate).toLocaleDateString() : '-'}</td>,
      <td key="evidence" className="py-3 px-4">
        {report.evidence ? <a href={report.evidence} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Bukti</a> : '-'}
      </td>,
      <td key="status" className="py-3 px-4"><Badge type={report.status?.toLowerCase() || 'pending'} text={REPORT_STATUSES[report.status?.toUpperCase()] || 'Menunggu'} /></td>,
      <td key="actions" className="py-3 px-4 flex space-x-2">
        {report.status === 'pending' && (
          <>
            <Button
              onClick={() => handleVerify(report.id, 'accepted', type)}
              className="bg-green-500 text-white hover:bg-green-400 text-sm"
            >
              <i className="fas fa-check mr-2"></i> Terima
            </Button>
            <Button
              onClick={() => handleVerify(report.id, 'rejected', type)}
              className="bg-red-500 text-white hover:bg-red-400 text-sm"
            >
              <i className="fas fa-times mr-2"></i> Tolak
            </Button>
          </>
        )}
      </td>,
    ];
  };

  return (
    <motion.div
      className="flex min-h-screen bg-pinjol-light-1 font-roboto"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <Sidebar role="admin" />
      <div className="flex-1 flex justify-center items-start py-6 overflow-x-hidden">
        <div className="container mx-auto max-w-6xl px-4 w-full">
          <h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 text-center">
            Verifikasi Laporan
          </h1>
          <ErrorMessage message={error} onClose={() => setError('')} />
          <SuccessMessage message={success} onClose={() => setSuccess('')} />
          {isLoading && <Spinner />}
          <Card title="Daftar Laporan">
            <div className="flex justify-between mb-4">
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
            </div>
            <Table headers={headers} data={reports} renderRow={renderRow} />
          </Card>
        </div>
      </div>
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, id: null, status: '', type: '' })}
        onConfirm={confirmVerify}
        title={`Konfirmasi ${modal.status === 'accepted' ? 'Terima' : 'Tolak'}`}
        message={`Yakin ingin ${modal.status === 'accepted' ? 'menerima' : 'menolak'} laporan ini?`}
        confirmText={modal.status === 'accepted' ? 'Terima' : 'Tolak'}
      />
    </motion.div>
  );
}

export default ReportVerification;