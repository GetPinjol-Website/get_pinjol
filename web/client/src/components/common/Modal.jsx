import { motion } from 'framer-motion';
import { modalAnimation } from '../../utils/animations';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <motion.div
            {...modalAnimation}
            className="modal-overlay"
        >
            <div className="modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="modal-close">
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </motion.div>
    );
}

export default Modal;