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
            <td>{report.appName}</td>
            <td>{report.category}</td>
            <td>{new Date(report.incidentDate).toLocaleDateString()}</td>
            <td>Belum Diverifikasi</td>
        </>
    );

    return (
        <motion.div {...pageTransition} class="flex">
            <Sidebar role="admin" />
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