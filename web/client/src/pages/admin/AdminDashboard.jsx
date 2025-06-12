import { useState, useEffect } from 'react';
import AdminPresenter from '../../presenters/AdminPresenter';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import Sidebar from '../../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const presenter = new AdminPresenter({
        setLoading: setIsLoading,
        showError: setError,
        setReports,
    });

    useEffect(() => {
        presenter.getAllReports();
    }, []);

    const headers = ['Nama Aplikasi', 'Kategori', 'Tanggal Kejadian', 'Status'];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const renderRow = (report) => (
        <>
            <td>{report.appName}</td>
            <td>{report.category.join(', ')}</td>
            <td>{new Date(report.incidentDate).toLocaleDateString()}</td>
            <td>{report.status || 'Belum Diverifikasi'}</td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="flex">
            <Sidebar role="admin" onLogout={handleLogout} />
            <div className="content-with-sidebar">
                <h1>Dashboard Admin</h1>
                <ErrorMessage message={error} onClose={() => setError('')} />
                {isLoading && <Spinner />}
                <Card title="Ringkasan Laporan">
                    <Table headers={headers} data={reports} renderRow={renderRow} />
                </Card>
            </div>
        </motion.div>
    );
}

export default AdminDashboard;