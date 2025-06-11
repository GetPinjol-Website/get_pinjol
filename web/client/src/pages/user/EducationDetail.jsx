import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EducationPresenter from '../../presenters/EducationPresenter';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function EducationDetail() {
    const { id } = useParams();
    const [education, setEducation] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const presenter = new EducationPresenter({
        setLoading: setIsLoading,
        showError: setError,
        setEducation,
    });

    useEffect(() => {
        presenter.getEducationById(id);
    }, [id]);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    if (!education && !isLoading) {
        return (
            <motion.div {...pageTransition} className="bg-pinjol-light-1 min-h-screen py-16 font-roboto">
                <div className="container mx-auto px-4 text-center">
                    <ErrorMessage message={error || 'Konten tidak ditemukan'} onClose={() => setError('')} />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div {...pageTransition} className="bg-pinjol-light-1 min-h-screen py-16 font-roboto">
            <div className="container mx-auto px-4">
                <ErrorMessage message={error} onClose={() => setError('')} />
                {isLoading && <Spinner />}
                {education && (
                    <motion.div
                        className="max-w-3xl mx-auto"
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants}
                    >
                        <Link
                            to="/education"
                            className="inline-flex items-center text-pinjol-dark-3 hover:text-pinjol-dark-2 mb-6"
                        >
                            <i className="fas fa-arrow-left mr-2"></i> Kembali ke Edukasi
                        </Link>
                        <div className="bg-pinjol-light-2 rounded-xl shadow-lg p-6">
                            <img
                                src="/landing/getpinjol-education-graph.jpg"
                                alt={education.title}
                                className="w-full h-64 object-cover rounded-t-xl mb-6"
                            />
                            <h1 className="text-3xl font-bold text-pinjol-dark-2 mb-4">{education.title}</h1>
                            <div className="flex justify-between text-sm text-pinjol-dark-4 mb-6">
                                <span>
                                    <i className="fas fa-tag mr-1"></i>
                                    {education.category || 'N/A'}
                                </span>
                                <span>
                                    <i className="fas fa-calendar-alt mr-1"></i>
                                    {new Date(education.date).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <p className="text-pinjol-dark-1 leading-relaxed">{education.content}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default EducationDetail;