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
        showError: (message) => {
            setError(message);
            window.Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonColor: '#255F38',
                background: '#ECFAE5',
            });
        },
        setTopReports,
    });

    useEffect(() => {
        presenter.getTopReports();
    }, []);

    return (
        <motion.div {...pageTransition} className="min-h-screen bg-pinjol-light-1">
            <header className="bg-pinjol-dark-4 text-pinjol-light-1 py-8 text-center">
                <img src="/logo.png" alt="Get Pinjol Logo" className="mx-auto h-16 mb-4" />
                <h1 className="text-4xl font-bold">Selamat Datang di Get Pinjol</h1>
                <p className="mt-2 text-lg">Platform terpercaya untuk melaporkan dan mengedukasi tentang pinjaman online</p>
            </header>
            <main className="container mx-auto px-4 py-8">
                <ErrorMessage message={error} onClose={() => setError('')} />
                {isLoading && <Spinner />}
                <section className="grid gap-8 md:grid-cols-2">
                    <Card title="Statistik Laporan Teratas" className="bg-white shadow-lg">
                        <ul className="space-y-2">
                            {topReports.map((report) => (
                                <li key={report._id} className="flex items-center text-pgray-700">
                                    <i className="fas fa-exclamation-circle mr-2 text-pinjol-dark-3"></i>
                                    {report._id}: {report.count} laporan
                                </li>
                            ))}
                        </ul>
                    </Card>
                    <Card title="Tentang Kami" className="bg-white shadow-lg">
                        <p className="text-pgray-600">
                            Get Pinjol adalah platform untuk melaporkan masalah terkait pinjaman online dan menyediakan edukasi untuk meningkatkan kesadaran masyarakat.
                        </p>
                    </Card>
                </section>
            </main>
        </motion.div>
    );
}

export default Landing;