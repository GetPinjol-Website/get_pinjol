import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Card({ title, children, className }) {
    return (
        <motion.div
            {...pageTransition}
            className={`bg-pinjol-light-2 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className || ''}`}
        >
            {title && <h3 className="text-xl font-semibold text-pinjol-dark-2 mb-4">{title}</h3>}
            {children}
        </motion.div>
    );
}

export default Card;