import { useState, useEffect } from 'react';
import AdminPresenter from '../../presenters/AdminPresenter';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import Sidebar from '../../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function AdminDashboard() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const presenter = new AdminPresenter({
        setLoading: setIsLoading,
        showError: setError,
        setReports,
    });

    useEffect(() => {
        presenter.getAllReports();
    }, []);

    const headers = ['Nama Aplikasi', 'Kategori', 'Tanggal Kejadian', 'Status'];

    const renderRow = (report) => (
        <>
            <td className="px-4 py-2">{report.appName}</td>
            <td className="px-4 py-2">{report.category}</td>
            <td className="px-4 py-2">{new Date(report.incidentDate).toLocaleDateString()}</td>
            <td className="px-4 py-2">Belum Diverifikasi</td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="flex">
            <Sidebar role="admin" />
            <div className="flex-1 p-4 ml-64">
                <h1 className="text-2xl font-bold text-dark-green-900 mb-4">Dashboard Admin</h1>
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