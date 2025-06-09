import { useState, useEffect } from 'react';
import EducationPresenter from '../../presenters/EducationPresenter';
import Card from '../../components/ui/Card';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations.jsx';

function Education() {
    const [educations, setEducations] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const presenter = new EducationPresenter({
        setLoading: setIsLoading,
        showError: setError,
        setEducations,
    });

    useEffect(() => {
        presenter.getAllEducation();
    }, []);

    return (
        <motion.div {...pageTransition} className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-dark-green-900 mb-4">Edukasi</h1>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {isLoading && <Spinner />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {educations.map((edu) => (
                    <Card key={edu.id} title={edu.title}>
                        <p className="text-dark-green-900">{edu.content.substring(0, 100)}...</p>
                        <p className="text-sm text-gray-600 mt-2">
                            Kategori: {edu.category || 'N/A'} | Tanggal: {new Date(edu.date).toLocaleDateString()}
                        </p>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}

export default Education;