import React, { useEffect, useState } from 'react';
import UserDashboardPage from './UserDashboardPage.jsx';
import { getEducations, getReports } from '../../utils/api.js';

const UserDashboardPresenter = () => {
  const [educations, setEducations] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eduResponse, reportResponse] = await Promise.all([getEducations(), getReports()]);
        setEducations(eduResponse.data);
        setReports(reportResponse.data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadData();
  }, []);

  return <UserDashboardPage educations={educations} reports={reports} />;
};

export default UserDashboardPresenter;