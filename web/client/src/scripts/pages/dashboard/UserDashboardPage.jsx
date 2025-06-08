import React from 'react';

const UserDashboardPage = ({ educations, reports }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{dashboardData.user.title}</h1>
      <h2 className="text-xl mt-4">Educations</h2>
      <ul className="mt-2">{educations.map(e => <li key={e.id}>{e.title}</li>)}</ul>
      <h2 className="text-xl mt-4">Reports</h2>
      <ul className="mt-2">{reports.map(r => <li key={r.id}>{r.appName}</li>)}</ul>
      <p><a href="/report/web" className="text-blue-500">Create Web Report</a></p>
      <p><a href="/report/app" className="text-blue-500">Create App Report</a></p>
    </div>
  );
};

export default UserDashboardPage;