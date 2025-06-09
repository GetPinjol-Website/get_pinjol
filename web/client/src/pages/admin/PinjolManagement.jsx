import { useState, useEffect } from 'react';
import AdminPresenter from '../../presenters/AdminPresenter';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import Sidebar from '../../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function PinjolManagement() {
    const [pinjols, setPinjols] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const presenter = new AdminPresenter({
        setLoading: setIsLoading,
        showError: setError,
        setPinjols,
    });

    useEffect(() => {
        presenter.getAllPinjols();
    }, []);

    const headers = ['Nama Pinjol', 'Prediksi', 'Aksi'];

    const renderRow = (pinjol) => (
        <>
            <td>{pinjol.name || 'N/A'}</td>
            <td>{pinjol.prediction || 'N/A'}</td>
            <td><a href="#">Edit</a></td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="flex">
            <Sidebar role="admin" />
            <div className="content-with-sidebar">
                <h1 className="container">Manajemen Pinjaman Online</h1>
                <ErrorMessage message={error} onClose={() => setError('')} />
                {isLoading && <Spinner />}
                <Card title="Daftar Pinjol">
                    <Table headers={headers} data={pinjols} renderRow={renderRow} />
                </Card>
            </div>
        </motion.div>
    );
}

export default PinjolManagement;