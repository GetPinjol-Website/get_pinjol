import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EducationPresenter from '../../presenters/EducationPresenter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { motion } from 'framer-motion';

function EducationDetail() {
    const [education, setEducation] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

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
            <FullScreenSection className="bg-pinjol-light-1 text-pinjol-dark-1 py-16">
                <div className="container mx-auto px-4 text-center">
                    <ErrorMessage message={error || 'Konten tidak ditemukan'} onClose={() => setError('')} />
                    <Button
                        onClick={() => navigate('/education')}
                        className="inline-flex items-center px-4 py-2 bg-pinjol-dark-3 text-white rounded-md font-medium hover:bg-pinjol-dark-2 transition-colors"
                    >
                        <i className="fas fa-arrow-left mr-2"></i> Kembali ke Edukasi
                    </Button>
                </div>
            </FullScreenSection>
        );
    }

    return (
        <FullScreenSection className="bg-pinjol-light-1 text-pinjol-dark-1 py-16">
            <div className="container mx-auto px-4">
                {isLoading && <Spinner />}
                <ErrorMessage message={error} onClose={() => setError('')} />
                {education && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={itemVariants}
                    >
                        <Button
                            onClick={() => navigate('/education')}
                            className="inline-flex items-center px-4 py-2 bg-pinjol-light-4 text-pinjol-dark-2 rounded-md font-medium hover:bg-pinjol-light-3 mb-6"
                        >
                            <i className="fas fa-arrow-left mr-2"></i> Kembali
                        </Button>
                        <h1 className="text-4xl font-bold text-pinjol-dark-3 mb-6">{education.title}</h1>
                        <p className="text-sm text-pinjol-dark-3 mb-6">
                            Kategori: {education.category || 'Umum'} | Tanggal: {new Date(education.date).toLocaleDateString('id-ID')}
                        </p>
                        {education.image ? (
                            <img
                                src={education.image}
                                alt={education.title}
                                className="w-full max-w-2xl mx-auto h-64 object-cover rounded-lg mb-6"
                            />
                        ) : (
                            <div className="w-full max-w-2xl mx-auto h-64 bg-pinjol-light-3 rounded-lg mb-6 flex items-center justify-center">
                                <i className="fas fa-image text-pinjol-dark-4 text-3xl"></i>
                            </div>
                        )}
                        <div className="text-pinjol-dark-1 leading-relaxed">{education.content}</div>
                    </motion.div>
                )}
            </div>
        </FullScreenSection>
    );
}

export default EducationDetail;