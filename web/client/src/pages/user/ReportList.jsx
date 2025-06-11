import { useState, useEffect } from 'react';
import ReportPresenter from '../../presenters/ReportPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import { REPORT_TYPES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function ReportList({ isOfflineMode }) {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ appName: '', category: '', type: '' });

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
    setReports,
  });

  useEffect(() => {
    presenter.getAllReports(filters);
  }, []);

  const handleSearch = (newFilters) => {
    presenter.getAllReports(newFilters);
  };

  const headers = ['Tipe', 'Nama Aplikasi', 'Kategori', 'Tanggal Kejadian', 'Status'];

  const renderRow = (report) => (
    <>
      <td>{report.type === REPORT_TYPES.WEB ? 'Web' : 'App'}</td>
      <td>{report.appName}</td>
      <td>{report.category.join(', ')}</td>
      <td>{new Date(report.incidentDate).toLocaleDateString()}</td>
      <td>{report.status || 'Pending'}</td>
    </>
  );

  return (
    <FullScreenSection>
      <motion.div {...pageTransition} className="container">
        <h1 className="text-2xl font-bold mb-4">Daftar Laporan</h1>
        <ErrorMessage message={error} onClose={() => setError('')} />
        {isLoading && <Spinner />}
        {isOfflineMode && (
          <p className="text-yellow-600 mb-4">Mode offline: Menampilkan laporan lokal.</p>
        )}
        <Card title="Cari Laporan">
          <SearchBar filters={filters} setFilters={setFilters} onSearch={handleSearch} />
          <Table headers={headers} data={reports} renderRow={renderRow} />
        </Card>
      </motion.div>
    </FullScreenSection>
  );
}

export default ReportList;