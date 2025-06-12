import { useState, useEffect } from 'react';
import AdminPresenter from '../../presenters/AdminPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import Sidebar from '../../components/layout/Sidebar';
import { REPORT_TYPES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function ReportVerification({ isOfflineMode }) {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('');

  const presenter = new AdminPresenter({
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
    setReports,
  });

  useEffect(() => {
    presenter.getAllReports({ type: filterType });
  }, [filterType]);

  const handleVerify = async (id, status, type) => {
    window.Swal.fire({
      icon: 'warning',
      title: `Konfirmasi ${status}`,
      text: `Yakin ingin ${status.toLowerCase()} laporan ini?`,
      showCancelButton: true,
      confirmButtonText: status,
      cancelButtonText: 'Batal',
      confirmButtonColor: '#658147',
      background: '#E7F0dc',
    }).then((result) => {
      if (result.isConfirmed) {
        presenter.verifyReport(id, { status: status.toLowerCase() === 'Diterima' ? 'accepted' : 'rejected' }, type);
      }
    });
  };

  const headers = ['Tipe', 'Nama Aplikasi', 'Kategori', 'Tanggal Kejadian', 'Status', 'Aksi'];

  const renderRow = (report) => [
    <td key="type" className="py-4 px-6">{report.type === REPORT_TYPES.WEB ? 'Web' : 'App'}</td>,
    <td key="appName" className="py-4 px-6">{report.appName}</td>,
    <td key="category" className="py-4 px-6">{report.category.join(', ')}</td>,
    <td key="incidentDate" className="py-4 px-6">{new Date(report.incidentDate).toLocaleDateString()}</td>,
    <td key="status" className="py-4 px-6">{report.status || 'Pending'}</td>,
    <td key="actions" className="py-4 px-6 flex space-x-2">
      <Button
        onClick={() => handleVerify(report.id, 'Diterima', report.type)}
        className="bg-green-500 text-white"
      >
        Terima
      </Button>
      <Button
        onClick={() => handleVerify(report.id, 'Ditolak', report.type)}
        className="bg-red-500 text-white"
      >
        Tolak
      </Button>
    </td>,
  ];

  return (
    <motion.div {...pageTransition} className="flex">
      <Sidebar role="admin" />
      <FullScreenSection>
        <div className="content-with-sidebar">
          <h1 className="text-2xl font-bold mb-4">Verifikasi Laporan</h1>
          <ErrorMessage message={error} onClose={() => setError('')} />
          <SuccessMessage message={success} onClose={() => setSuccess('')} />
          {isLoading && <Spinner />}
          {isOfflineMode && (
            <p className="text-yellow-600 mb-4">Mode offline: Hanya menampilkan laporan lokal.</p>
          )}
          <Card title="Daftar Laporan">
            <div className="flex mb-4">
              <div className="flex items-center space-x-2">
                <label className="font-medium">Filter Tipe:</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-pinjol-light-4 rounded-lg px-3 py-2"
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
      </FullScreenSection>
    </motion.div>
  );
}

export default ReportVerification;