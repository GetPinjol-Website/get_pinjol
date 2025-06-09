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
        <form onSubmit={handleSubmit} className={className}>
            {children}
        </form>
    );
}

export default Form;