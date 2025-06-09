import { motion } from 'framer-motion';
import { modalAnimation } from '../../utils/animations';

function ErrorMessage({ message, onClose }) {
    if (!message) return null;

    return (
        <motion.div
            {...modalAnimation}
            className="error-message"
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

export default ErrorMessage;