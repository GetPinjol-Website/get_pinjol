import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import { REPORT_TYPES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Dashboard({ isOfflineMode }) {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
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
    setReports,
    navigate,
    refreshReports: () => presenter.getUserReports({ type: filterType }),
  });

  useEffect(() => {
    presenter.getUserReports({ type: filterType });
  }, [filterType]);

  const handleDelete = (id, type) => {
    window.Swal.fire({
      icon: 'warning',
      title: 'Konfirmasi Hapus',
      text: 'Yakin ingin menghapus laporan ini?',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#658147',
      background: '#E7F0DC',
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === REPORT_TYPES.WEB) {
          presenter.deleteWebReport(id);
        } else {
          presenter.deleteAppReport(id);
        }
      }
    });
  };

  const headers = ['Tipe', 'Nama Aplikasi', 'Kategori', 'Tanggal Kejadian', 'Status', 'Aksi'];

  const renderRow = (report) => (
    <>
      <td>{report.type === REPORT_TYPES.WEB ? 'Web' : 'App'}</td>
      <td>{report.appName}</td>
      <td>{report.category.join(', ')}</td>
      <td>{new Date(report.incidentDate).toLocaleDateString()}</td>
      <td>{report.status || 'Pending'}</td>
      <td className="space-x-2">
        <Button onClick={() => navigate(`/report/edit/${report.id}`)} className="bg-pinjol-dark-3 text-white">
          Edit
        </Button>
        <Button
          onClick={() => handleDelete(report.id, report.type)}
          className="bg-red-500 text-white"
        >
          Hapus
        </Button>
      </td>
    </>
  );

  return (
    <FullScreenSection>
      <motion.div {...pageTransition} className="container">
        <h1 className="text-2xl font-bold mb-4">Dashboard Pengguna</h1>
        <ErrorMessage message={error} onClose={() => setError('')} />
        {isLoading && <Spinner />}
        <Card title="Laporan Anda">
          <div className="flex justify-between mb-4">
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
            <Button onClick={() => navigate('/report/new')} className="bg-pinjol-dark-3 text-white">
              Buat Laporan Baru
            </Button>
          </div>
          {isOfflineMode && (
            <p className="text-yellow-600 mb-4">Mode offline: Laporan disimpan lokal dan akan disinkronkan saat online.</p>
          )}
          <Table headers={headers} data={reports} renderRow={renderRow} />
        </Card>
      </motion.div>
    </FullScreenSection>
  );
}

export default Dashboard;