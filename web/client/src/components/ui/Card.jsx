import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Card({ title, children, className }) {
    return (
        <motion.div
            {...pageTransition}
            className={`card ${className || ''}`}
        >
            {title && <h3>{title}</h3>}
            {children}
        </motion.div>
    );
}

export default Card;