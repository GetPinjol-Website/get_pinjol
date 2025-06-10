import { motion } from 'framer-motion';
import { modalAnimation } from '../../utils/animations';

function SuccessMessage({ message, onClose }) {
    if (!message) return null;

    return (
        <motion.div
            {...modalAnimation}
            className="fixed position-top-4 right-4 z-50 bg-pgray-light-4 text-pgray-dark-2 rounded-lg p-4 shadow-lg max-w-sm"
        >
            <div className="flex items-center">
                <i className="fas fa-check-circle text-pgray-dark-3 mr-2"></i>
                <p className="text-pgray-800">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-auto text-pgray-600 hover:text-gray-800"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>
        </motion.div>
    );
}

export default SuccessMessage;