import { useState, useEffect } from 'react';
import ReportPresenter from '../presenters/ReportPresenter';
import Card from '../components/ui/Card';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import Spinner from '../components/common/Spinner';
import { motion } from 'framer-motion';
import { pageTransition } from '../utils/animations';

function Landing() {
    const [topReports, setTopReports] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const presenter = new ReportPresenter({
        setLoading: setIsLoading,
        showError: setError,
        setTopReports,
    });

    useEffect(() => {
        presenter.getTopReports();
    }, []);

    return (
        <motion.div {...pageTransition} className="container">
            <h1>Selamat Datang di Get Pinjol</h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {isLoading && <Spinner />}
            <Card title="Statistik Laporan Teratas">
                <ul>
                    {topReports.map((report) => (
                        <li key={report._id}>
                            {report._id}: {report.count} laporan
                        </li>
                    ))}
                </ul>
            </Card>
            <Card title="Tentang Kami">
                <p>
                    Get Pinjol adalah platform untuk melaporkan masalah terkait pinjaman online dan menyediakan edukasi untuk meningkatkan kesadaran masyarakat.
                </p>
            </Card>
        </motion.div>
    );
}

export default Landing;