import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function DropdownChecklist({ options, selected = [], onChange, label, name }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (value) => {
    const updatedSelection = Array.isArray(selected) && selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...(Array.isArray(selected) ? selected : []), value];
    onChange(updatedSelection);
  };

  return (
    <div className="input-group mb-4 relative w-max">
      <label className="block text-pgray-700 font-medium mb-2">
        {label}<span className="text-red-600">*</span>
      </label>
      <div className="relative">
        <button
          type="button"
          id="dropdownToggle"
          onClick={handleToggle}
          className="px-5 py-2.5 rounded-sm text-white text-sm font-medium cursor-pointer border-0 outline-0 bg-pinjol-dark-1 hover:bg-pinjol-dark-2 active:bg-pinjol-dark-1 flex items-center justify-between w-full"
        >
          <span className="truncate">
            {Array.isArray(selected) && selected.length > 0
              ? selected
                  .map((val) => options.find((opt) => opt.value === val)?.label)
                  .filter(Boolean)
                  .join(', ')
              : 'Pilih kategori'}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 fill-white inline ml-3"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              id="dropdownMenu"
              className="absolute block shadow-lg bg-white py-2 px-2 z-[1000] min-w-full w-max rounded-sm max-h-48 overflow-auto"
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  className="dropdown-item py-2.5 px-4 hover:bg-pinjol-light-1 rounded-sm text-pgray-700 text-sm font-medium cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      id={`checkbox-${option.value}`}
                      type="checkbox"
                      className="hidden peer"
                      checked={Array.isArray(selected) && selected.includes(option.value)}
                      onChange={() => handleCheckboxChange(option.value)}
                    />
                    <label
                      htmlFor={`checkbox-${option.value}`}
                      className="relative mr-3 flex items-center justify-center p-1 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-pinjol-dark-1 border border-pinjol-dark-4 rounded-sm overflow-hidden"
                    >
                      <i
                        className="fas fa-check text-white text-xs hidden peer-checked:block"
                        aria-hidden="true"
                      ></i>
                    </label>
                    <span>{option.label}</span>
                  </div>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DropdownChecklist;