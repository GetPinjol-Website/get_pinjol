import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Footer() {
    return (
        <motion.footer
            {...pageTransition}
            className="bg-pinjol-dark-1 text-pinjol-light-1 py-10"
        >
            <div className="container mx-auto px-[5%]">
                <div className="grid gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Hubungi Kami</h3>
                        <p className="flex items-center mb-2">
                            <i className="fas fa-envelope mr-2 text-pinjol-light-2"></i>
                            support@getpinjol.com
                        </p>
                        <p className="flex items-center">
                            <i className="fas fa-phone mr-2 text-pinjol-light-2"></i>
                            +62 123 456 7890
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Tentang Kami</h3>
                        <p>
                            Get Pinjol adalah platform terpercaya untuk memeriksa keamanan pinjaman online dan memberikan edukasi finansial guna melindungi masyarakat.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Tautan Cepat</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="flex items-center hover:text-pinjol-light-2 transition-colors">
                                    <i className="fas fa-home mr-2"></i> Beranda
                                </a>
                            </li>
                            <li>
                                <a href="/pinjol" className="flex items-center hover:text-pinjol-light-2 transition-colors">
                                    <i className="fas fa-list mr-2"></i> Daftar Pinjol
                                </a>
                            </li>
                            <li>
                                <a href="/education" className="flex items-center hover:text-pinjol-light-2 transition-colors">
                                    <i className="fas fa-book mr-2"></i> Edukasi
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 flex flex-col items-center">
                    <div className="flex space-x-4 mb-4">
                        <a href="#" className="text-pinjol-light-2 hover:text-pinjol-light-1 transition-colors">
                            <i className="fab fa-github text-xl"></i>
                        </a>
                        <a href="#" className="text-pinjol-light-2 hover:text-pinjol-light-1 transition-colors">
                            <i className="fab fa-x"></i>
                        </a>
                        <a href="#" className="text-pinjol-light-2 hover:text-pinjol-light-1 transition-colors">
                            <i className="fab fa-linkedin text-xl"></i>
                        </a>
                    </div>
                    <p className="text-sm">
                        © 2025 Get Pinjol. Semua Hak Dilindungi.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}

export default Footer;