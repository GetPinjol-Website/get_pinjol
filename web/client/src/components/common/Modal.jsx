import { motion } from 'framer-motion';
import { modalAnimation } from '../../utils/animations';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <motion.div
            {...modalAnimation}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div className="bg-cream-100 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-dark-green-900">{title}</h2>
                    <button onClick={onClose} className="text-dark-green-900 hover:text-green-600">
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </motion.div>
    );
}

export default Modal;