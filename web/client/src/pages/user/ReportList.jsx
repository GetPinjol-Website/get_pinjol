import { useState, useEffect } from 'react';
import ReportPresenter from '../../presenters/ReportPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { REPORT_TYPES, REPORT_STATUSES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function ReportList({ isOfflineMode }) {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ filters: { appName: '', category: '', type: '' } });

  const presenter = new ReportPresenter({
    setLoading: setIsLoading,
    showError: setError,
    setReports, // Pastikan setReports diteruskan
  });

  useEffect(() => {
    presenter.getAllReports(filters);
  }, [filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const headers = ['Tipe', 'Nama Aplikasi', 'Kategori', 'Tanggal', 'Status'];

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
            <i className="fas fa-list-alt mr-3"></i>
            Daftar Laporan
          </motion.h1>
          {isOfflineMode && (
            <motion.p
              className="text-yellow-600 mb-6 flex items-center"
              variants={itemVariants}
            >
              <i className="fas fa-exclamation-circle mr-2"></i>
              Mode offline: Menampilkan laporan lokal.
            </motion.p>
          )}
          <ErrorMessage message={error} onClose={() => setError('')} />
          {isLoading && <Spinner />}
          <Card title="Cari Laporan">
            <motion.div variants={itemVariants}>
              <SearchBar filters={filters} setFilters={setFilters} onSearch={handleSearch} />
            </motion.div>
            <Table headers={headers} data={reports} renderRow={renderRow} />
          </Card>
        </motion.div>
      </FullScreenSection>
    </div>
  );
}

export default ReportList;