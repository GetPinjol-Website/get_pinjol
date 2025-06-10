function Form({ onSubmit, children, className }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            onSubmit(e);
        } catch (error) {
            window.Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Form submission failed',
                confirmButtonColor: '#255F38',
                background: '#ECFAE5',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            {children}
        </form>
    );
}

export default Form;