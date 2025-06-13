import { useState, useEffect } from 'react';
import ReportPresenter from '../presenters/ReportPresenter';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import Spinner from '../components/common/Spinner';
import FullScreenSection from '../components/ui/FullScreenSection';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';
import DecorativeImage from '../components/common/DecorativeImage';

function Landing() {
    const [totalAppReports, setTotalAppReports] = useState(0);
    const [mostReportedWeb, setMostReportedWeb] = useState({ appName: '', count: 0 });
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
        setTotalAppReports,
        setMostReportedWeb,
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                await presenter.getAllReports({ type: 'app' });
                const webReports = await presenter.getAllReports({ type: 'web' });
                if (webReports && webReports.length > 0) {
                    const counts = {};
                    webReports.forEach(report => {
                        counts[report.appName] = (counts[report.appName] || 0) + 1;
                    });
                    const mostReported = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
                    setMostReportedWeb({ appName: mostReported, count: counts[mostReported] });
                }
            } catch (error) {
                setError('Gagal mengambil statistik laporan');
            }
        };
        fetchStatistics();
    }, []);

    const handleCheckSubmit = async (e) => {
        e.preventDefault();
        if (!checkInput) {
            window.Swal.fire({
                icon: 'warning',
                title: 'Input Kosong',
                text: 'Silakan masukkan nama aplikasi untuk dilakukan pengecekan keamanan.',
                confirmButtonColor: '#255F38',
                background: '#ECFAE5',
                fontFamily: 'Roboto, sans-serif',
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`http://20.2.114.187:3000/analisis?app_name=${encodeURIComponent(checkInput)}`);
            if (!response.ok) {
                throw new Error('Gagal memeriksa aplikasi');
            }
            const data = await response.json();

            // Menampilkan pop-up dengan hasil analisis
            window.Swal.fire({
                title: `Hasil Analisis: ${data.aplikasi}`,
                html: `
                    <div class="text-left font-roboto space-y-4">
                        <p><strong>Developer:</strong> ${data.developer}</p>
                        <p><strong>Status Legalitas:</strong> 
                            <span class="${data.status_legalitas === 'legal' ? 'text-green-600' : 'text-red-600'}">
                                ${data.status_legalitas.charAt(0).toUpperCase() + data.status_legalitas.slice(1)}
                            </span>
                        </p>
                        <p><strong>Rating Playstore:</strong> ${data.rating_playstore} ⭐</p>
                        <p><strong>Rekomendasi:</strong> ${data.rekomendasi}</p>
                        <div class="mt-4">
                            <h3 class="font-semibold">Detail Analisis Sentimen:</h3>
                            <p><strong>Total Ulasan:</strong> ${data.detail_analisis.total_ulasan_dianalisis}</p>
                            <div class="grid grid-cols-3 gap-2 mt-2">
                                <div>
                                    <p class="text-green-600">Positif: ${data.detail_analisis.sentimen_positif}</p>
                                </div>
                                <div>
                                    <p class="text-red-600">Negatif: ${data.detail_analisis.sentimen_negatif}</p>
                                </div>
                                <div>
                                    <p class="text-gray-600">Netral: ${data.detail_analisis.sentimen_netral}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                icon: data.status_legalitas === 'legal' ? 'success' : 'warning',
                confirmButtonColor: '#255F38',
                background: '#ECFAE5',
                customClass: {
                    popup: 'rounded-lg shadow-xl',
                    title: 'text-2xl font-bold text-gray-800',
                    htmlContainer: 'text-gray-700',
                },
                width: '90vw',
                maxWidth: '600px',
            });
            setCheckInput('');
        } catch (err) {
            window.Swal.fire({
                icon: 'error',
                title: 'Pengecekan Gagal',
                text: 'Terjadi kesalahan saat memeriksa aplikasi. Silakan coba lagi.',
                confirmButtonColor: '#255F38',
                background: '#ECFAE5',
                fontFamily: 'Roboto, sans-serif',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <div className="bg-pinjol-light-1 font-roboto">
            <FullScreenSection id="hero" className="bg-gradient-to-b from-pinjol-dark-4 to-pinjol-dark-3 text-white flex items-center justify-center relative py-[25%] sm">
                <div className="absolute inset-0 bg-[url('/landing/getpinjol-security-shield.jpg')] bg-cover bg-center" style={{ filter: 'blur(4px)' }}></div>
                <div className="absolute inset-0 bg-pinjol-dark-1 bg-opacity-70"></div>
                <div className="relative z-10 text-center max-w-4xl space-y-10 mx-auto px-4">
                    <motion.img
                        src="/logo.png"
                        alt="Get Pinjol Logo"
                        className="mx-auto h-20 mb-8 animate-pulse"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                    />
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold mb-8 drop-shadow-lg"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0.2}
                    >
                        Pendeteksi Keamanan Pinjol
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0.4}
                    >
                        Lindungi keuangan Anda dari pinjaman online berisiko dengan platform canggih kami! Get Pinjol membantu Anda memverifikasi keamanan aplikasi pinjaman, mencegah penipuan, dan memberikan edukasi finansial yang terpercaya.
                    </motion.p>
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0.6}
                    >
                        <Button
                            as="a"
                            href="#checker"
                            className="inline-flex items-center px-6 py-3 bg-black bg-opacity-80 text-white rounded-md font-medium hover:bg-gray-800 hover:bg-opacity-100 transition-colors drop-shadow-md"
                        >
                            <i className="fas fa-shield-alt mr-2"></i> Mulai Pengecekan Sekarang
                        </Button>
                    </motion.div>
                </div>
            </FullScreenSection>

            <FullScreenSection id="features" className="bg-pinjol-light-1 text-pinjol-dark-1 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-pinjol-dark-3 mb-12 text-center">Fitur Unggulan Kami</h2>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.2 },
                            },
                        }}
                    >
                        <motion.div
                            className="bg-pinjol-light-2 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                            variants={itemVariants}
                        >
                            <DecorativeImage
                                src="/landing/getpinjol-education-graph.jpg"
                                alt="Education Graph"
                                className="absolute top-0 right-0 w-20 h-20 opacity-20 rounded-full"
                            />
                            <i className="fas fa-shield-alt text-4xl text-pinjol-dark-3 mb-4 relative z-10"></i>
                            <h3 className="text-2xl font-semibold text-pinjol-dark-2 mb-3 relative z-10">Analisis Keamanan Real-Time</h3>
                            <p className="text-pinjol-dark-1 relative z-10">
                                Cek aplikasi pinjol dalam hitungan detik! Teknologi canggih kami memindai risiko dan memberikan laporan keamanan instan untuk melindungi Anda dari penipuan.
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-pinjol-light-2 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                            variants={itemVariants}
                        >
                            <DecorativeImage
                                src="/landing/getpinjol-community-report.jpg"
                                alt="Community Report"
                                className="absolute top-0 right-0 w-20 h-20 opacity-20 rounded-full"
                            />
                            <i className="fas fa-users text-4xl text-pinjol-dark-3 mb-4 relative z-10"></i>
                            <h3 className="text-2xl font-semibold text-pinjol-dark-2 mb-3 relative z-10">Laporan Komunitas</h3>
                            <p className="text-pinjol-dark-1 relative z-10">
                                Bergabunglah dengan ribuan pengguna yang berbagi pengalaman. Laporan komunitas kami membantu Anda mengenali pinjol aman dan menghindari yang berisiko.
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-pinjol-light-2 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                            variants={itemVariants}
                        >
                            <DecorativeImage
                                src="/landing/getpinjol-trust-badge.jpg"
                                alt="Trust Badge"
                                className="absolute top-0 right-0 w-20 h-20 opacity-20 rounded-full"
                            />
                            <i className="fas fa-book-open text-4xl text-pinjol-dark-3 mb-4 relative z-10"></i>
                            <h3 className="text-2xl font-semibold text-pinjol-dark-2 mb-3 relative z-10">Edukasi Finansial</h3>
                            <p className="text-pinjol-dark-1 relative z-10">
                                Tingkatkan literasi keuangan Anda dengan panduan praktis dan tips cerdas dari Get Pinjol. Kelola uang Anda dengan percaya diri!
                            </p>
                        </motion.div>
                    </motion.div>
                    <div className="text-center mt-10">
                        <Button
                            as="a"
                            href="#checker"
                            className="inline-flex items-center px-6 py-3 bg-pinjol-dark-3 text-white rounded-md font-medium hover:bg-pinjol-dark-2 transition-colors"
                        >
                            <i className="fas fa-rocket mr-2"></i> Coba Sekarang
                        </Button>
                    </div>
                </div>
            </FullScreenSection>

            <FullScreenSection id="stats" className="bg-pinjol-light-3 text-pinjol-dark-2 py-16">
                <div className="container mx-auto px-4">
                    <motion.h2
                        className="text-4xl font-bold text-pinjol-dark-3 mb-12 text-center"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Statistik Keamanan Pinjol
                    </motion.h2>
                    <motion.p
                        className="text-lg mb-10 max-w-2xl mx-auto text-center"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Ribuan pengguna telah melaporkan pinjol berisiko. Lihat data terbaru dari komunitas kami dan lindungi diri Anda dari penipuan!
                    </motion.p>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.2 },
                            },
                        }}
                    >
                        <motion.div
                            className="bg-pinjol-light-2 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
                            variants={itemVariants}
                        >
                            <i className="fas fa-mobile-alt text-3xl text-pinjol-dark-3 mr-4"></i>
                            <div>
                                <h3 className="text-xl font-semibold text-pinjol-dark-1">Total Laporan Aplikasi</h3>
                                <p className="text-pinjol-dark-2">{totalAppReports} laporan</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="bg-pinjol-light-2 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
                            variants={itemVariants}
                        >
                            <i className="fas fa-globe text-3xl text-pinjol-dark-3 mr-4"></i>
                            <div>
                                <h3 className="text-xl font-semibold text-pinjol-dark-1">Laporan Web Paling Banyak</h3>
                                <p className="text-pinjol-dark-2">{mostReportedWeb.appName} ({mostReportedWeb.count} laporan)</p>
                            </div>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className="text-center mt-10"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Button
                            as="a"
                            href="#checker"
                            className="inline-flex items-center px-6 py-3 bg-pinjol-dark-3 text-white rounded-md font-medium hover:bg-pinjol-dark-2 transition-colors"
                        >
                            <i className="fas fa-chart-bar mr-2"></i> Lihat Laporan Lengkap
                        </Button>
                    </motion.div>
                </div>
            </FullScreenSection>

            <FullScreenSection id="checker" className="bg-pinjol-light-1 text-pinjol-dark-1 py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/landing/getpinjol-security-shield.jpg')] bg-cover bg-center opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.h2
                        className="text-4xl font-bold text-pinjol-dark-3 mb-6"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Cek Keamanan Pinjaman Sekarang!
                    </motion.h2>
                    <motion.p
                        className="text-lg mb-8 max-w-2xl mx-auto"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Ketik nama aplikasi pinjol, dan dapatkan laporan keamanan instan dari komunitas kami. Amankan keuangan Anda dalam satu klik!
                    </motion.p>
                    <motion.form
                        onSubmit={handleCheckSubmit}
                        className="flex flex-col md:flex-row items-center justify-center gap-4"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <input
                            type="text"
                            value={checkInput}
                            onChange={(e) => setCheckInput(e.target.value)}
                            placeholder="Masukkan nama aplikasi"
                            className="w-full max-w-md px-4 py-3 border-2 border-pinjol-light-4 rounded-lg text-pinjol-dark-1 focus:outline-none focus:border-pinjol-dark-3 focus:ring-2 focus:ring-pinjol-dark-3 transition-all"
                        />
                        <Button
                            type="submit"
                            className="inline-flex items-center px-6 py-3 bg-pinjol-dark-3 text-white rounded-lg font-medium hover:bg-pinjol-dark-2 transition-colors"
                        >
                            <i className="fas fa-search mr-2"></i> Cek Sekarang
                        </Button>
                    </motion.form>
                </div>
            </FullScreenSection>

            {isLoading && <Spinner />}
            <ErrorMessage message={error} onClose={() => setError('')} />
        </div>
    );
}

export default Landing;