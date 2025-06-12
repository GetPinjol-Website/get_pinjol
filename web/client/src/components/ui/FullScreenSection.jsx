import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function FullScreenSection({ children, className, id }) {
    return (
        <motion.section
            {...pageTransition}
            id={id}
            className={`min-h-screen flex items-center justify-center px-[5%] ${className || ''} font-arial overflow-hidden`}
        >
            <div className="w-full max-w-4xl mx-auto items-center justify-center">
                {children}
            </div>
        </motion.section>
    );
}

export default FullScreenSection;