function Input({ label, type = 'text', value, onChange, name, required, className }) {
    return (
        <div className="input-group">
            <label>
                {label}
                {required && <span className="required">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                name={name}
                required={required}
                className={className}
            />
        </div>
    );
}

export default Input;