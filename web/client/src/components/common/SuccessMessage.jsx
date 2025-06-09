import { motion } from 'framer-motion';
import { modalAnimation } from '../../utils/animations';

function SuccessMessage({ message, onClose }) {
    if (!message) return null;

    return (
        <motion.div
            {...modalAnimation}
            className="success-message"
        >
            <div>
                <p>{message}</p>
                <button
                    onClick={onClose}
                    className="message-close"
                >
                    ✕
                </button>
            </div>
        </motion.div>
    );
}

export default SuccessMessage;