import { motion } from 'framer-motion';
import { buttonHover } from '../../utils/animations';

function Button({ children, onClick, disabled, className, type = 'button' }) {
    return (
        <motion.button
            whileHover={!disabled ? buttonHover : {}}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center px-4 py-2 rounded-md font-arial font-medium transition-colors duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
        >
            {children}
        </motion.button>
    );
}

export default Button;