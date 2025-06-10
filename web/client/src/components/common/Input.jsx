function Input({ label, type = 'text', value, onChange, name, required, className }) {
    return (
        <div className="mb-4">
            <label className="block text-pgray-700 font-medium mb-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                name={name}
                required={required}
                className={`w-full px-3 py-2 border border-pinjol-light-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pinjol-dark-3 ${className || ''}`}
            />
        </div>
    );
}

export default Input;