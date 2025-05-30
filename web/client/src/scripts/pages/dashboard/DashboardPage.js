import React from 'react';
import DashboardPagePresenter from './presenter/DashboardPagePresenter';
import DashboardPageModel from './model/DashboardPageModel';

const DashboardPage = () => {
  const presenter = new DashboardPagePresenter(new DashboardPageModel());
  const stats = presenter.getStats();

  return (
    <div className="min-h-screen bg-[#18230F] text-[#FFFDF6] p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1F7D53] p-4 rounded">
          <h2>Total Laporan</h2>
          <p>{stats.totalReports}</p>
        </div>
        <div className="bg-[#1F7D53] p-4 rounded">
          <h2>Laporan Tertunda</h2>
          <p>{stats.pendingReports}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;