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
            <td>{report.appName}</td>
            <td>{report.category}</td>
            <td>{new Date(report.incidentDate).toLocaleDateString()}</td>
            <td>
                <Button onClick={() => navigate(`/report/edit/${report.id}`)}>
                    Edit
                </Button>
            </td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="container">
            <h1>Dashboard Pengguna</h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {isLoading && <Spinner />}
            <Card title="Laporan Anda">
                <Button onClick={() => navigate('/report/new')}>
                    Buat Laporan Baru
                </Button>
                <Table headers={headers} data={reports} renderRow={renderRow} />
            </Card>
        </motion.div>
    );
}

export default Dashboard;