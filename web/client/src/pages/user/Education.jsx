import { useState, useEffect } from 'react';
import EducationPresenter from '../../presenters/EducationPresenter';
import Card from '../../components/ui/Card';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

function Education() {
  const [educations, setEducations] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const presenter = new EducationPresenter({
    setLoading: setIsLoading,
    showError: setError,
    setEducations,
    navigate: () => {}, // Tidak diperlukan di sini
    showSuccess: () => {}, // Tidak diperlukan di sini
  });

  useEffect(() => {
    presenter.getAllEducation();
  }, []);

  return (
    <motion.div {...pageTransition} className="container">
      <h1>Edukasi</h1>
      <ErrorMessage message={error} onClose={() => setError('')} />
      {isLoading && <Spinner />}
      <div className="grid grid-3">
        {educations.map((edu) => (
          <Card key={edu.id} title={edu.title}>
            <p>{edu.content.substring(0, 100)}...</p>
            <p>
              Kategori: {edu.category || 'N/A'} | Tanggal: {new Date(edu.date).toLocaleDateString('id-ID')}
            </p>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

export default Education;