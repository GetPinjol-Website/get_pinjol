import { motion } from 'framer-motion';

function Card({ title, children, className }) {
    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
        hover: { scale: 1.02, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)', transition: { duration: 0.3 } },
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`bg-pinjol-light-2 p-6 rounded-xl shadow-lg border-2 border-pinjol-light-4 hover:border-pinjol-dark-3 transition-all duration-300 font-roboto ${className || ''}`}
        >
            {title && (
                <h3 className="text-lg font-semibold text-pinjol-dark-2 mb-3">
                    {title}
                </h3>
            )}
            {children}
        </motion.div>
    );
}

export default Card;