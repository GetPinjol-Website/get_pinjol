import { useState, useEffect } from 'react';
import ReportPresenter from '../presenters/ReportPresenter';
import Card from '../components/ui/Card';
import ErrorMessage from '../components/common/ErrorMessage';
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
        <motion.div {...pageTransition} className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-dark-green-900 mb-4">Selamat Datang di Pinjol Report</h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {isLoading && <Spinner />}
            <Card title="Statistik Laporan Teratas">
                <ul className="space-y-2">
                    {topReports.map((report) => (
                        <li key={report._id} className="text-dark-green-900">
                            {report._id}: {report.count} laporan
                        </li>
                    ))}
                </ul>
            </Card>
            <Card title="Tentang Kami">
                <p className="text-dark-green-900">
                    Pinjol Report adalah platform untuk melaporkan masalah terkait pinjaman online dan menyediakan edukasi untuk meningkatkan kesadaran masyarakat.
                </p>
            </Card>
        </motion.div>
    );
}

export default Landing;