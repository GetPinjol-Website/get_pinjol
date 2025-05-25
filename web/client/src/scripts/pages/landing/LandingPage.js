import React from 'react';
import { LandingPresenter } from './LandingPresenter';
import '../../styles/tailwind.css';

export function LandingPage() {
    const presenter = new LandingPresenter();
    const stats = presenter.getStats();

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold mb-4">Selamat Datang di GetPinjol</h1>
            <p className="mb-4">Cek keamanan aplikasi pinjaman online dan pelajari cara memilih pinjol yang legal.</p>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-100 rounded">
                    <h3 className="font-bold">Total Laporan</h3>
                    <p>{stats.totalReports}</p>
                </div>
                <div className="p-4 bg-red-100 rounded">
                    <h3 className="font-bold">Pinjol Ilegal</h3>
                    <p>{stats.illegalPinjols}</p>
                </div>
            </div>
        </div>
    );
}