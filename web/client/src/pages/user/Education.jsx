import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EducationPresenter from '../../presenters/EducationPresenter';
import Card from '../../components/ui/Card';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import FullScreenSection from '../../components/ui/FullScreenSection';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';

function Education() {
    const [educations, setEducations] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const presenter = new EducationPresenter({
        setLoading: setIsLoading,
        showError: setError,
        setEducations,
    });

    useEffect(() => {
        presenter.getAllEducation();
    }, []);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <FullScreenSection id="education" className="bg-pinjol-light-1 text-pinjol-dark-1 py-16">
            <div className="container mx-auto px-4">
                <motion.h1
                    className="text-4xl font-bold text-pinjol-dark-3 mb-12 text-center"
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    Edukasi Keuangan untuk Anda
                </motion.h1>
                <motion.p
                    className="text-lg mb-10 max-w-2xl mx-auto text-center"
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    Tingkatkan literasi keuangan Anda dengan artikel dan panduan praktis dari Get Pinjol. Pelajari cara mengelola uang dengan cerdas!
                </motion.p>
                {isLoading && <Spinner />}
                <ErrorMessage message={error} onClose={() => setError('')} />
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { transition: { staggerChildren: 0.2 } },
                    }}
                >
                    {educations.length > 0 ? (
                        educations.map((edu) => (
                            <motion.div
                                key={edu.id}
                                className="bg-pinjol-light-2 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                                variants={itemVariants}
                            >
                                {edu.image ? (
                                    <img
                                        src={edu.image}
                                        alt={edu.title}
                                        className="w-full h-40 object-cover rounded-md mb-4"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-pinjol-light-3 rounded-md mb-4 flex items-center justify-center">
                                        <i className="fas fa-image text-pinjol-dark-4 text-2xl"></i>
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold text-pinjol-dark-2 mb-2">{edu.title}</h3>
                                <p className="text-pinjol-dark-1 mb-4">{edu.content.substring(0, 100)}...</p>
                                <p className="text-sm text-pinjol-dark-3 mb-4">
                                    Kategori: {edu.category || 'Umum'} | Tanggal: {new Date(edu.date).toLocaleDateString('id-ID')}
                                </p>
                                <Button
                                    onClick={() => navigate(`/education/${edu.id}`)}
                                    className="inline-flex items-center px-4 py-2 bg-pinjol-dark-3 text-white rounded-md font-medium hover:bg-pinjol-dark-2 transition-colors"
                                >
                                    <i className="fas fa-book-open mr-2"></i> Baca Selengkapnya
                                </Button>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            className="col-span-full text-center text-pinjol-dark-1"
                            variants={itemVariants}
                        >
                            Belum ada konten edukasi. Tunggu pembaruan terbaru!
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </FullScreenSection>
    );
}

export default Education;