import { motion } from 'framer-motion';
import { modalAnimation } from '../../utils/animations';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <motion.div
            {...modalAnimation}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div className="bg-pinjol-light-1 rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-pinjol-dark-2">{title}</h2>
                    <button onClick={onClose} className="text-pgray-600 hover:text-pgray-800">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                {children}
            </div>
        </motion.div>
    );
}

export default Modal;