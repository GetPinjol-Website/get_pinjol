import { motion } from 'framer-motion';
import { modalAnimation } from '../../utils/animations';
import Button from './Button';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) {
  if (!isOpen) return null;

  return (
    <motion.div
      {...modalAnimation}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-pinjol-light-1 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-pinjol-dark-2 mb-4">{title}</h2>
        <p className="text-pinjol-dark-1 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <Button
            onClick={onClose}
            className="bg-pinjol-light-4 text-pinjol-dark-2 hover:bg-pinjol-light-3"
          >
            {cancelText || 'Batal'}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-pinjol-dark-3 text-white hover:bg-pinjol-dark-2"
          >
            {confirmText || 'Konfirmasi'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default ConfirmationModal;