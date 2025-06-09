import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations.jsx';

function Footer() {
    return (
        <motion.footer {...pageTransition} className="bg-dark-green-900 text-cream-100 py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Kontak Kami</h3>
                        <p>Email: support@pinjolreport.com</p>
                        <p>Telepon: +62 123 456 7890</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Tentang</h3>
                        <p>Aplikasi untuk melaporkan dan mengedukasi tentang pinjaman online.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Link Cepat</h3>
                        <ul>
                            <li><a href="/" className="hover:text-light-green-300">Beranda</a></li>
                            <li><a href="/pinjol" className="hover:text-light-green-300">Daftar Pinjol</a></li>
                            <li><a href="/education" className="hover:text-light-green-300">Edukasi</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p>&copy; 2025 Pinjol Report. All rights reserved.</p>
                </div>
            </div>
        </motion.footer>
    );
}

export default Footer;