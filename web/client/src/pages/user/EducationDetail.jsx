import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EducationPresenter from '../../presenters/EducationPresenter';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import FullScreenSection from '../../components/ui/FullScreenSection';
import ContentWrapper from '../../components/common/ContentWrapper';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function EducationDetail() {
  const { id } = useParams();
  const [education, setEducation] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');
  const presenter = new EducationPresenter({
    setLoading: setIsLoading,
    showError: setError,
    setEducation: (data) => setEducation({ ...data }), // Pastikan referensi baru
    navigate: () => {},
    showSuccess: () => {},
  });

  useEffect(() => {
    presenter.getEducationById(id, token, { _t: Date.now() });
  }, [id]);

  if (!education && !isLoading && !error) {
    return (
      <FullScreenSection className="bg-pinjol-light-1 py-16 font-roboto">
        <ContentWrapper bgColor="bg-pinjol-light-3">
          <ErrorMessage message="Konten tidak ditemukan" onClose={() => setError('')} />
        </ContentWrapper>
      </FullScreenSection>
    );
  }

  return (
    <FullScreenSection className="bg-pinjol-light-1 py-16 font-roboto">
      <ContentWrapper bgColor="bg-pinjol-light-3">
        <ErrorMessage message={error} onClose={() => setError('')} />
        {isLoading && <Spinner />}
        {education && (
          <motion.div className="max-w-3xl mx-auto" initial="hidden" animate="visible" variants={itemVariants}>
            <Link to="/education" className="inline-flex items-center text-pinjol-dark-3 hover:text-pinjol-dark-2 mb-6 transition-colors duration-300">
              <i className="fas fa-arrow-left mr-2"></i> Kembali ke Edukasi
            </Link>
            <motion.h1 className="text-4xl font-bold text-pinjol-dark-2 mb-4 text-center" variants={itemVariants}>
              {education.title}
            </motion.h1>
            <motion.div className="flex justify-between text-sm text-pinjol-dark-4 mb-6" variants={itemVariants}>
              <span><i className="fas fa-tag mr-1"></i>{education.category || 'N/A'}</span>
              <span><i className="fas fa-calendar-alt mr-1"></i>{new Date(education.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </motion.div>
            <motion.p className="text-pinjol-dark-1 leading-relaxed" variants={itemVariants}>
              {education.content}
            </motion.p>
          </motion.div>
        )}
      </ContentWrapper>
    </FullScreenSection>
  );
}

export default EducationDetail;