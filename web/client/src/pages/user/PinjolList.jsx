import { useState, useEffect } from 'react';
import PinjolPresenter from '../../presenters/PinjolPresenter';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function PinjolList() {
    const [pinjols, setPinjols] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const presenter = new PinjolPresenter({
        setLoading: setIsLoading,
        showError: setError,
        setPinjols,
    });

    useEffect(() => {
        presenter.getAllPinjol();
    }, []);

    const headers = ['Nama Pinjol', 'Prediksi', 'Aksi'];

    const renderRow = (pinjol) => (
        <>
            <td>{pinjol.name || 'N/A'}</td>
            <td>{pinjol.prediction || 'N/A'}</td>
            <td>
                <a href="#">Detail</a>
            </td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="container">
            <h1>Daftar Pinjaman Online</h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {isLoading && <Spinner />}
            <Card title="Daftar Pinjol">
                <Table headers={headers} data={pinjols} renderRow={renderRow} />
            </Card>
        </motion.div>
    );
}

export default PinjolList;