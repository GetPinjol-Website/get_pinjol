import { motion } from 'framer-motion';
import { buttonHover } from '../../utils/animations';

function Button({ children, onClick, disabled, className, type = 'button' }) {
    return (
        <motion.button
            whileHover={!disabled ? buttonHover : {}}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn ${disabled ? 'disabled' : ''} ${className || ''}`}
        >
            {children}
        </motion.button>
    );
}

export default Button;