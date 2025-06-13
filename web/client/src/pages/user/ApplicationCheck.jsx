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
import Sidebar from '../../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function ApplicationCheck() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ name: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const appsPerPage = 25;

  const presenter = new ReportPresenter({
    setLoading: setIsLoading,
    showError: setError,
    showSuccess: setSuccess,
    setApplications: (data) => {
      setApplications(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    },
    refreshReports: () => presenter.getAllApplications({ ...filters, _t: Date.now() }),
  });

  useEffect(() => {
    presenter.getAllApplications({ ...filters, _t: Date.now() });
  }, [filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const headers = ['Tipe', 'Nama Aplikasi', 'Laporan Rendah', 'Laporan Sedang', 'Laporan Tinggi', 'Rekomendasi'];

  const renderRow = (app) => {
    return [
      <td key="type" className="py-3 px-4"><Badge type={app.type} text={app.type === 'web' ? 'Web' : 'App'} /></td>,
      <td key="name" className="py-3 px-4">{app.name || '-'}</td>,
      <td key="lowCount" className="py-3 px-4">{app.lowCount || 0}</td>,
      <td key="mediumCount" className="py-3 px-4">{app.mediumCount || 0}</td>,
      <td key="highCount" className="py-3 px-4">{app.highCount || 0}</td>,
      <td key="recommendation" className="py-3 px-4">
        <Badge type={app.recommendationStatus} text={app.recommendation || 'Belum Diketahui'} />
      </td>,
    ];
  };

  const indexOfLastApp = currentPage * appsPerPage;
  const indexOfFirstApp = indexOfLastApp - appsPerPage;
  const currentApps = applications.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(applications.length / appsPerPage);

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
        <div className="container mx-auto max-w-4xl px-4 w-full">
          <h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 text-center">
            Cek Aplikasi
          </h1>
          <ErrorMessage message={error} onClose={() => setError('')} />
          <SuccessMessage message={success} onClose={() => setSuccess('')} />
          {isLoading && <Spinner />}
          <Card title="Cari Aplikasi">
            <div className="mb-4">
              <SearchBar
                filters={filters}
                setFilters={setFilters}
                onSearch={handleSearch}
                fields={[
                  { name: 'name', label: 'Nama Aplikasi', type: 'text' },
                  { name: 'type', label: 'Tipe', type: 'select', options: ['', 'web', 'app'].map((val) => ({ value: val, label: val === '' ? 'Semua' : val === 'web' ? 'Web' : 'App' })) },
                ]}
              />
            </div>
            <Table
              headers={headers}
              data={currentApps}
              renderRow={renderRow}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default ApplicationCheck;