function Input({ label, type = 'text', value, onChange, name, required, className }) {
    return (
        <div className="mb-4">
            <label className="block text-dark-green-900 font-medium mb-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                name={name}
                required={required}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-cream-200 text-dark-green-900 ${className}`}
            />
        </div>
    );
}

export default Input;