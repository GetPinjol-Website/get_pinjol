import { useState, useEffect } from 'react';
import ReportPresenter from '../presenters/ReportPresenter';
import Card from '../components/ui/Card';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import Spinner from '../components/common/Spinner';
import FullScreenSection from '../components/ui/FullScreenSection';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';
import { pageTransition } from '../utils/animations';
import DecorativeImage from '../components/common/DecorativeImage';

function Landing() {
    const [topReports, setTopReports] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkInput, setCheckInput] = useState('');

    const presenter = new ReportPresenter({
        setLoading: setIsLoading,
        showError: (message) => {
            setError(message);
            window.Swal.fire({
                icon: 'error',
                title: 'Peringatan',
                text: message,
                confirmButtonColor: '#255F38',
                background: '#ECFAE5',
                fontFamily: 'Roboto, sans-serif',
            });
        },
        setTopReports,
    });

    useEffect(() => {
        presenter.getTopReports();
    }, []);

    const handleCheckSubmit = (e) => {
        e.preventDefault();
        if (!checkInput) {
            window.Swal.fire({
                icon: 'warning',
                title: 'Input Kosong',
                text: 'Silakan masukkan nama aplikasi atau URL website untuk dilakukan pengecekan keamanan.',
                confirmButtonColor: '#255F38',
                background: '#ECFAE5',
                fontFamily: 'Roboto, sans-serif',
            });
            return;
        }
        window.Swal.fire({
            icon: 'success',
            title: 'Pengecekan Berhasil Dimulai',
            text: `Kami sedang memverifikasi "${checkInput}". Hasil lengkap akan segera tersedia. Terima kasih atas kepercayaan Anda menggunakan layanan kami!`,
            confirmButtonColor: '#255F38',
            background: '#ECFAE5',
            fontFamily: 'Roboto, sans-serif',
        });
        setCheckInput('');
    };

    return (
        <div className="bg-pinjol-light-1 font-roboto">
            <FullScreenSection id="hero" className="bg-gradient-to-b from-pinjol-dark-4 to-pinjol-dark-3 text-pinjol-light-1 flex items-center justify-center">
                <div className="text-center max-w-4xl">
                    <img src="/logo.png" alt="Get Pinjol Logo" className="mx-auto h-20 mb-6 animate-pulse" />
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Pendeteksi Keamanan Pinjol</h1>
                    <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                        Lindungi keuangan Anda dari pinjaman online berisiko dengan platform canggih kami! Get Pinjol membantu Anda memverifikasi keamanan aplikasi pinjaman, mencegah penipuan, dan memberikan edukasi finansial yang terpercaya.
                    </p>
                    <Button
                        as="a"
                        href="#checker"
                        className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
                    >
                        <i className="fas fa-shield-alt mr-2"></i> Mulai Pengecekan Sekarang
                    </Button>
                </div>
                <div className="absolute right-0 top-0 mt-16 mr-16">
                    <img src="/getpinjol-security-shield.jpg" alt="Security Shield" className="w-96 h-auto rounded-lg shadow-lg" />
                </div>
            </FullScreenSection>

            <FullScreenSection id="features" className="bg-pinjol-light-1 text-pinjol-dark-1 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-pinjol-dark-3 mb-6 text-center">Fitur Unggulan</h2>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <p className="text-lg mb-6 max-w-lg">
                                Get Pinjol menawarkan analisis real-time untuk mendeteksi pinjaman online aman, laporan komunitas, dan panduan edukasi finansial. Lindungi diri Anda dari penipuan dengan data terpercaya!
                            </p>
                            <Button>
                                <i className="fas fa-check-circle mr-2"></i> Pelajari Lebih Lanjut
                            </Button>
                        </div>
                        <div className="md:w-1/2 flex justify-around">
                            <DecorativeImage src="/getpinjol-education-graph.jpg" alt="Education Graph" className="w-32 h-32 rounded-full" />
                            <DecorativeImage src="/getpinjol-community-report.jpg" alt="Community Report" className="w-32 h-32 rounded-full" />
                            <DecorativeImage src="/getpinjol-trust-badge.jpg" alt="Trust Badge" className="w-32 h-32 rounded-full" />
                        </div>
                    </div>
                </div>
            </FullScreenSection>

            <FullScreenSection id="stats" className="bg-pinjol-light-3 text-pinjol-dark-2 py-16">
                <div className="container mx-auto px-4 text-left">
                    <h2 className="text-4xl font-bold mb-6">Statistik Keamanan</h2>
                    <p className="text-lg mb-8 max-w-2xl">
                        Data terbaru menunjukkan ribuan laporan dari komunitas kami, membantu Anda menghindari pinjaman berisiko.
                    </p>
                    <Card className="bg-white shadow-md p-6">
                        <ul className="space-y-3">
                            {topReports.map((report) => (
                                <li key={report._id} className="flex items-center text-pinjol-dark-1">
                                    <i className="fas fa-exclamation-circle mr-2 text-pinjol-dark-3"></i>
                                    <span className="font-medium">{report._id}</span>: {report.count} laporan
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </FullScreenSection>

            <FullScreenSection id="checker" className="bg-pinjol-light-1 text-pinjol-dark-1 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-pinjol-dark-3 mb-6">Cek Keamanan Pinjaman</h2>
                    <p className="text-lg mb-6 max-w-2xl mx-auto">
                        Masukkan nama aplikasi atau URL untuk mendapatkan laporan keamanan instan dari komunitas kami.
                    </p>
                    <form onSubmit={handleCheckSubmit} className="flex flex-col items-center">
                        <input
                            type="text"
                            value={checkInput}
                            onChange={(e) => setCheckInput(e.target.value)}
                            placeholder="Masukkan nama aplikasi atau URL website"
                            className="w-full max-w-md px-4 py-2 border-2 border-pinjol-light-4 rounded-md text-pinjol-dark-1 focus:outline-none focus:border-pinjol-dark-3 mb-4"
                        />
                        <Button type="submit">
                            <i className="fas fa-search mr-2"></i> Mulai Pengecekan
                        </Button>
                    </form>
                </div>
                <div className="absolute bottom-0 right-0 mb-8 mr-8">
                    <img src="/getpinjol-financial-expert.jpg" alt="Financial Expert" className="w-48 h-auto rounded-lg shadow-lg" />
                </div>
            </FullScreenSection>

            {isLoading && <Spinner />}
            <ErrorMessage message={error} onClose={() => setError('')} />
        </div>
    );
}

export default Landing;