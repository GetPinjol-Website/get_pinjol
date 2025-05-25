import React, { useState, useEffect } from 'react';
import { DashboardPresenter } from './DashboardPresenter';
import '../../styles/tailwind.css';

export function DashboardPage() {
    const presenter = new DashboardPresenter();
    const [stats, setStats] = useState({ totalReports: 0, pendingReports: 0 });

    useEffect(() => {
        presenter.getDashboardStats().then(setStats);
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard Admin</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-100 rounded">
                    <h3 className="font-bold">Total Laporan</h3>
                    <p>{stats.totalReports}</p>
                </div>
                <div className="p-4 bg-yellow-100 rounded">
                    <h3 className="font-bold">Laporan Menunggu</h3>
                    <p>{stats.pendingReports}</p>
                </div>
            </div>
        </div>
    );
}