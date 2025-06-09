import { motion } from 'framer-motion';
import { buttonHover } from '../../utils/animations';

function Button({ children, onClick, disabled, className, type = 'button' }) {
    return (
        <motion.button
            whileHover={!disabled ? buttonHover : {}}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${disabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-cream-100'
                } ${className}`}
        >
            {children}
        </motion.button>
    );
}

export default Button;