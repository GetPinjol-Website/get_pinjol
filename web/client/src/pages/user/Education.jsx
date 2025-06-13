import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EducationPresenter from '../../presenters/EducationPresenter';
import Card from '../../components/ui/Card';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import SearchFilter from '../../components/common/SearchFilter';
import FullScreenSection from '../../components/ui/FullScreenSection';
import ContentWrapper from '../../components/common/ContentWrapper';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/animations';

function Education() {
  const [educations, setEducations] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: '' });

  const token = localStorage.getItem('token');
  const presenter = new EducationPresenter({
    setLoading: setIsLoading,
    showError: setError,
    setEducations: (data) => setEducations([...data]), // Pastikan referensi baru
    navigate: () => {},
    showSuccess: () => {},
  });

  useEffect(() => {
    presenter.getAllEducation({ title: filters.search, category: filters.category, _t: Date.now() }, token);
  }, [filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <FullScreenSection className="bg-pinjol-light-1 py-16 font-roboto py-[25%] sm:py-[11%]">
      <ContentWrapper bgColor="bg-pinjol-light-2">
        <motion.h1 className="text-4xl font-bold text-pinjol-dark-3 mb-8 text-center" variants={itemVariants} initial="hidden" animate="visible">
          Edukasi
        </motion.h1>
        <ErrorMessage message={error} onClose={() => setError('')} />
        {isLoading && <Spinner />}
        <SearchFilter onSearch={handleSearch} filters={filters} setFilters={setFilters} />
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
          {educations.length > 0 ? (
            educations.map((edu) => (
              <Link to={`/education/${edu.id}`} key={edu.id}>
                <Card title={edu.title} className="h-full flex flex-col justify-between bg-white hover:bg-pinjol-light-2 transition-colors duration-300 p-4">
                  <motion.div variants={itemVariants}>
                    <p className="text-pinjol-dark-1 mb-4 flex-grow">{edu.content.substring(0, 100)}...</p>
                    <div className="flex justify-between text-sm text-pinjol-dark-4">
                      <span><i className="fas fa-tag mr-1"></i>{edu.category || 'N/A'}</span>
                      <span><i className="fas fa-calendar-alt mr-1"></i>{new Date(edu.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </motion.div>
                </Card>
              </Link>
            ))
          ) : (
            <motion.p className="text-pinjol-dark-2 text-center col-span-full" variants={itemVariants}>
              {error ? '' : 'Tidak ada konten edukasi yang ditemukan.'}
            </motion.p>
          )}
        </motion.div>
      </ContentWrapper>
    </FullScreenSection>
  );
}

export default Education;