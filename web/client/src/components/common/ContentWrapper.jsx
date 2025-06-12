import React from 'react';
import { motion } from 'framer-motion';

function ContentWrapper({ children, bgColor = 'bg-pinjol-light-1', className }) {
  return (
    <motion.div
      className={`w-full h-full ${bgColor} rounded-xl shadow-lg p-8 ${className || ''}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default ContentWrapper;