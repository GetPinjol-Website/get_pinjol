import React, { useEffect, useState } from 'react';
import { ReportListPage, ReportFormPage } from './ReportPage.jsx';
import { getReports, createReportWeb, createReportApp } from '../../utils/api.js';
import { saveData } from '../../utils/db.js';

const ReportPresenter = () => {
    const [reports, setReports] = useState([]);
    const [message, setMessage] = useState('');
    const path = window.location.pathname;

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await getReports();
                setReports(response.data);
            } catch (error) {
                console.error('Error loading reports:', error);
            }
        };
        if (path === '/report') loadData();
    }, [path]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const reportData = {
            appName: formData.get('appName'),
            description: formData.get('description'),
            ...(path.includes('web') ? { incidentDate: formData.get('incidentDate') } : {}),
        };
        if (!navigator.onLine) {
            await saveData('offlineReports', { id: Date.now().toString(), ...reportData, type: path.includes('web') ? 'web' : 'app' });
            setMessage('Saved offline, will sync when online');
            return;
        }
        try {
            const response = await (path.includes('web') ? createReportWeb : createReportApp)(reportData);
            setMessage(response.pesan);
        } catch (error) {
            setMessage(error.pesan || 'Error submitting report');
        }
    };

    return path === '/report' ? (
        <ReportListPage reports={reports} />
    ) : (
        <ReportFormPage type={path.includes('web') ? 'web' : 'app'} onSubmit={handleSubmit} />
    );
};

export default ReportPresenter;