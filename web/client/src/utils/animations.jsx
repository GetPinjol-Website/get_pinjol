import { motion } from 'framer-motion';

// Animasi untuk transisi halaman
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

// Animasi untuk tombol
export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

// Animasi untuk modal
export const modalAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3 },
};

// Animasi untuk item individu (misalnya, kartu, baris tabel, input form)
export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Helper untuk menerapkan animasi ke komponen
export const withAnimation = (Component) => {
  return (props) => (
    <motion.div {...pageTransition}>
      <Component {...props} />
    </motion.div>
  );
};