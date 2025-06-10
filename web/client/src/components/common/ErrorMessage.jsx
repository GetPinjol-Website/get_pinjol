import { motion } from 'framer-motion';
import { modalAnimation } from '../../utils/animations';

function ErrorMessage({ message, onClose }) {
    if (!message) return null;

    return (
        <motion.div
            {...modalAnimation}
            className="fixed top-6 right-6 z-50 bg-pinjol-light-2/95 backdrop-blur-sm border border-pinjol-dark-3 rounded-xl p-4 shadow-xl max-w-sm"
        >
            <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-pinjol-dark-4 mr-3 text-xl"></i>
                <p className="text-pinjol-dark-2">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-auto text-pinjol-dark-3 hover:text-pinjol-dark-4 transition-colors"
                >
                    <i className="fas fa-times text-lg"></i>
                </button>
            </div>
        </motion.div>
    );
}

export default ErrorMessage;