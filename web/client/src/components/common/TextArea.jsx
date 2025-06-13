import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function TextArea({ label, name, value, onChange, required = false, placeholder = '', className = '', rows = 4 }) {
  return (
    <motion.div className="mb-4" variants={itemVariants}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-pinjol-dark-3 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border border-pinjol-light-3 rounded-md bg-pinjol-light-2 text-pinjol-dark-3 focus:outline-none focus:ring-2 focus:ring-pinjol-dark-3 focus:border-transparent resize-y ${className}`}
      />
    </motion.div>
  );
}

export default TextArea;