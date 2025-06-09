import { useState, useEffect } from 'react';
import AdminPresenter from '../../presenters/AdminPresenter';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';
import Spinner from '../../components/common/Spinner';
import Sidebar from '../../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function ReportVerification() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const presenter = new AdminPresenter({
        setLoading: setIsLoading,
        showError: setError,
        showSuccess: setSuccess,
        setReports,
    });

    useEffect(() => {
        presenter.getAllReports();
    }, []);

    const handleVerify = async (id, status) => {
        await presenter.verifyReport(id, status);
        presenter.getAllReports();
    };

    const headers = ['Nama Aplikasi', 'Kategori', 'Tanggal Kejadian', 'Aksi'];

    const renderRow = (report) => (
        <>
            <td>{report.appName}</td>
            <td>{report.category}</td>
            <td>{new Date(report.incidentDate).toLocaleDateString()}</td>
            <td>
                <Button
                    onClick={() => handleVerify(report.id, 'Diterima')}
                    className="mr-2 btn"
                >
                    Terima
                </Button>
                <Button
                    onClick={() => handleVerify(report.id, 'Ditolak')}
                    className="btn-danger"
                >
                    Tolak
                </Button>
            </td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="flex">
            <Sidebar role="admin" />
            <div className="content-with-sidebar">
                <h1>Verifikasi Laporan</h1>
                <ErrorMessage message={error} onClose={() => setError('')} />
                <SuccessMessage message={success} onClose={() => setSuccess('')} />
                {isLoading && <Spinner />}
                <Card title="Daftar Laporan">
                    <Table headers={headers} data={reports} renderRow={renderRow} />
                </Card>
            </div>
        </motion.div>
    );
}

export default ReportVerification;