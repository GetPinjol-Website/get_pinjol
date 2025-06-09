import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations.jsx';

function Card({ title, children, className }) {
    return (
        <motion.div
            {...pageTransition}
            className={`bg-cream-200 p-4 rounded-lg shadow-md border border-gray-200 ${className}`}
        >
            {title && <h3 className="text-lg font-semibold text-dark-green-900 mb-2">{title}</h3>}
            {children}
        </motion.div>
    );
}

export default Card;