import React, { useEffect, useState } from 'react';
import { EducationListPage, EducationDetailPage } from './EducationPage.jsx';
import { getEducations, getEducationById } from '../../utils/api.js';

const EducationPresenter = () => {
    const [educations, setEducations] = useState([]);
    const [selectedEducation, setSelectedEducation] = useState(null);
    const path = window.location.pathname;

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await getEducations();
                setEducations(response.data);
                if (path !== '/education') {
                    const id = path.split('/').pop();
                    const detail = await getEducationById(id);
                    setSelectedEducation(detail.data);
                }
            } catch (error) {
                console.error('Error loading education data:', error);
            }
        };
        loadData();
    }, [path]);

    return path === '/education' ? (
        <EducationListPage educations={educations} />
    ) : (
        <EducationDetailPage education={selectedEducation} />
    );
};

export default EducationPresenter;