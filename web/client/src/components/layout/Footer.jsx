import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Footer() {
    return (
        <motion.footer {...pageTransition} className="footer">
            <div className="container">
                <div className="grid grid-3">
                    <div>
                        <h3>Kontak Kami</h3>
                        <p>Email: support@pinjolreport.com</p>
                        <p>Telepon: +62 123 456 7890</p>
                    </div>
                    <div>
                        <h3>Tentang</h3>
                        <p>Aplikasi untuk melaporkan dan mengedukasi tentang pinjaman online.</p>
                    </div>
                    <div>
                        <h3>Link Cepat</h3>
                        <ul>
                            <li><a href="/">Beranda</a></li>
                            <li><a href="/pinjol">Daftar Pinjol</a></li>
                            <li><a href="/education">Edukasi</a></li>
                        </ul>
                    </div>
                </div>
                <div className="copyright">
                    <p>© 2025 Pinjol Report. All rights reserved.</p>
                </div>
            </div>
        </motion.footer>
    );
}

export default Footer;