import { motion } from 'framer-motion';
import { modalAnimation } from '../../utils/animations.jsx';

function SuccessMessage({ message, onClose }) {
    if (!message) return null;

    return (
        <motion.div
            {...modalAnimation}
            className="fixed top-4 right-4 bg-green-600 text-cream-100 p-4 rounded-lg shadow-lg max-w-sm z-50"
        >
            <div className="flex justify-between items-center">
                <p>{message}</p>
                <button
                    onClick={onClose}
                    className="text-cream-100 hover:text-light-green-300"
                >
                    ✕
                </button>
            </div>
        </motion.div>
    );
}

export default SuccessMessage;