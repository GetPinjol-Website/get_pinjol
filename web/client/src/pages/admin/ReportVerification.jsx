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
import axios from 'axios';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function ReportVerification() {
  const [reports, setReports] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [modal, setModal] = useState({ isOpen: false, id: null, status: '', type: '', level: 'low' });

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
    setReports: (data) => {
      setReports([...data]);
      const userIds = [...new Set(data.map((report) => report.userId))];
      fetchUserNames(userIds);
    },
    refreshReports: () => presenter.getAllReports({ type: filterType, _t: Date.now() }),
  });

  const fetchUserNames = async (userIds) => {
    try {
      const token = localStorage.getItem('token');
      const newUserNames = { ...userNames };
      for (const userId of userIds) {
        if (!newUserNames[userId]) {
          console.log(`Fetching user name for userId: ${userId}`);
          const response = await axios.get(`http://localhost:9000/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          newUserNames[userId] = response.data.data.username || 'Tidak Diketahui';
        }
      }
      setUserNames(newUserNames);
    } catch (err) {
      console.error('Error fetching user names:', err);
      setError('Gagal mengambil data pengguna');
    }
  };

  useEffect(() => {
    presenter.getAllReports({ type: filterType, _t: Date.now() });
  }, [filterType]);

  const handleVerify = (id, status, type, level = 'low') => {
    console.log('Handle verify called with ID:', id, 'Status:', status, 'Type:', type, 'Level:', level);
    if (!type || ![REPORT_TYPES.WEB, REPORT_TYPES.APP].includes(type)) {
      setError('Tipe laporan tidak valid');
      return;
    }
    setModal({ isOpen: true, id, status, type, level });
  };

  const confirmVerify = async () => {
    const { id, status, type, level } = modal;
    try {
      console.log('Initiating verify for ID:', id, 'Status:', status, 'Type:', type, 'Level:', level);
      await presenter.verifyReport(id, { status, level }, type);
      setReports((prev) =>
        prev.map((report) =>
          report.id === id ? { ...report, status: status.toUpperCase(), level } : report
        )
      );
      setModal({ isOpen: false, id: null, status: '', type: '', level: 'low' });
    } catch (err) {
      console.error('Error in confirmVerify:', err);
      setError(err.message || 'Gagal memverifikasi laporan');
    }
  };

  const headers = ['Tipe', 'Nama Pengguna', 'Nama Aplikasi', 'Deskripsi', 'Kategori', 'Tanggal', 'Bukti', 'Tingkat', 'Status', 'Aksi'];

  const renderRow = (report) => {
    console.log('Rendering report:', report);
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
      <td key="level" className="py-3 px-4"><Badge type={report.level} text={report.level ? report.level.charAt(0).toUpperCase() + report.level.slice(1) : 'Low'} /></td>,
      <td key="status" className="py-3 px-4"><Badge type={report.status?.toLowerCase() || 'pending'} text={REPORT_STATUSES[report.status?.toUpperCase()] || 'Menunggu'} /></td>,
      <td key="actions" className="py-3 px-4 flex space-x-2">
        {report.status === 'pending' && (
          <>
            <select
              onChange={(e) => handleVerify(report.id, 'accepted', type, e.target.value)}
              className="border border-pinjol-light-4 rounded px-2 py-1 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <Button
              onClick={() => handleVerify(report.id, 'rejected', type, modal.level)}
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
    <div className="flex bg-pinjol-light-1">
      <Sidebar role="admin" />
      <div className="bg-pinjol-light-1 w-full">
        <FullScreenSection className="pt-20">
          <motion.div className="container mx-auto px-4" variants={itemVariants} initial="hidden" animate="visible">
            <motion.h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 flex items-center" variants={itemVariants}>
              <i className="fas fa-check-circle mr-3"></i> Verifikasi Laporan
            </motion.h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {isLoading && <Spinner />}
            <Card title="Daftar Laporan">
              <motion.div className="flex justify-between mb-4" variants={itemVariants}>
                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-pinjol-dark-2">Filter Tipe:</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border border-pinjol-light-4 rounded-lg px-3 py-2 bg-pinjol-light-2 focus:ring-2 focus:ring-pinjol-dark-3">
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
        onClose={() => setModal({ isOpen: false, id: null, status: '', type: '', level: 'low' })}
        onConfirm={confirmVerify}
        title={`Konfirmasi ${modal.status === 'accepted' ? 'Terima' : 'Tolak'}`}
        message={`Yakin ingin ${modal.status === 'accepted' ? `menerima laporan ini dengan tingkat ${modal.level}` : 'menolak laporan ini'}?`}
        confirmText={modal.status === 'accepted' ? 'Terima' : 'Tolak'}
      />
    </div>
  );
}

export default ReportVerification;