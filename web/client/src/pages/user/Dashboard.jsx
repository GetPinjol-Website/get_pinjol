import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportPresenter from '../../presenters/ReportPresenter';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Dashboard() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const presenter = new ReportPresenter({
        setLoading: setIsLoading,
        showError: setError,
        setReports,
        navigate,
    });

    useEffect(() => {
        presenter.getAllReports();
    }, []);

    const headers = ['Nama Aplikasi', 'Kategori', 'Tanggal Kejadian', 'Aksi'];

    const renderRow = (report) => (
        <>
            <td className="px-4 py-2">{report.appName}</td>
            <td className="px-4 py-2">{report.category}</td>
            <td className="px-4 py-2">{new Date(report.incidentDate).toLocaleDateString()}</td>
            <td className="px-4 py-2">
                <Button onClick={() => navigate(`/report/edit/${report.id}`)} className="mr-2">
                    Edit
                </Button>
            </td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-dark-green-900 mb-4">Dashboard Pengguna</h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {isLoading && <Spinner />}
            <Card title="Laporan Anda">
                <Button onClick={() => navigate('/report/new')} className="mb-4">
                    Buat Laporan Baru
                </Button>
                <Table headers={headers} data={reports} renderRow={renderRow} />
            </Card>
        </motion.div>
    );
}

export default Dashboard;