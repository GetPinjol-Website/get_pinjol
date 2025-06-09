function Form({ onSubmit, children, className }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            onSubmit(e);
        } catch (error) {
            alert(error.message || 'Gagal mengirimkan form');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
            {children}
        </form>
    );
}

export default Form;