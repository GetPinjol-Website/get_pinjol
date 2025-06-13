import { useState, useEffect } from 'react';
import ReportPresenter from '../../presenters/ReportPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { REPORT_TYPES, REPORT_STATUSES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function ReportList() {
  const [reports, setReports] = useState([]);
  const [recommendation, setRecommendation] = useState('Belum Diketahui');
  const [recommendationStatus, setRecommendationStatus] = useState('grey');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ appName: '', category: '', type: '' });

  const presenter = new ReportPresenter({
    setLoading: setIsLoading,
    showError: setError,
    showSuccess: setSuccess,
    setReports: (data) => {
      setReports(data.data || []);
      setRecommendation(data.recommendation || 'Belum Diketahui');
      setRecommendationStatus(data.recommendationStatus || 'grey');
    },
    refreshReports: () => presenter.getAllReports({ ...filters, _t: Date.now() }),
  });

  useEffect(() => {
    presenter.getAllReports({ ...filters, _t: Date.now() });
  }, [filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const headers = ['Tipe', 'Nama Aplikasi', 'Kategori', 'Tanggal', 'Status'];

  const renderRow = (report) => {
    const category = Array.isArray(report.category) ? report.category : [];
    return [
      <td key="type" className="py-3 px-4"><Badge type={report.type} text={report.type === REPORT_TYPES.WEB ? 'Web' : 'App'} /></td>,
      <td key="appName" className="py-3 px-4">{report.appName || '-'}</td>,
      <td key="category" className="py-3 px-4">{category.join(', ') || '-'}</td>,
      <td key="incidentDate" className="py-3 px-4">{report.incidentDate ? new Date(report.incidentDate).toLocaleDateString() : '-'}</td>,
      <td key="status" className="py-3 px-4"><Badge type={report.status?.toLowerCase() || 'pending'} text={REPORT_STATUSES[report.status?.toUpperCase()] || 'Menunggu'} /></td>,
    ];
  };

  const getRecommendationColor = () => {
    switch (recommendationStatus) {
      case 'green': return 'text-green-600';
      case 'red': return 'text-red-600';
      case 'yellow': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      className="flex min-h-screen bg-pinjol-light-1 font-roboto"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <FullScreenSection className="pt-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 flex items-center">
            <i className="fas fa-list-alt mr-3"></i> Daftar Laporan
          </h1>
          <p className={`text-lg font-semibold mb-4 flex items-center ${getRecommendationColor()}`}>
            <i className="fas fa-info-circle mr-2"></i> Rekomendasi: {recommendation}
          </p>
          <ErrorMessage message={error} onClose={() => setError('')} />
          <SuccessMessage message={success} onClose={() => setSuccess('')} />
          {isLoading && <Spinner />}
          <Card title="Cari Laporan">
            <div className="mb-4">
              <SearchBar filters={filters} setFilters={setFilters} onSearch={handleSearch} />
            </div>
            <Table headers={headers} data={reports} renderRow={renderRow} />
          </Card>
        </div>
      </FullScreenSection>
    </motion.div>
  );
}

export default ReportList;