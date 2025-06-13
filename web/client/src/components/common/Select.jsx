import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function Select({ label, name, value, onChange, options, required = false, disabled = false, className = '' }) {
  return (
    <motion.div className="mb-4" variants={itemVariants}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-pinjol-dark-3 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-pinjol-light-3 rounded-md bg-pinjol-light-2 text-pinjol-dark-3 focus:outline-none focus:ring-2 focus:ring-pinjol-dark-3 focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
}

export default Select;