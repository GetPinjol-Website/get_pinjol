import React from 'react';
import { AboutPresenter } from './AboutPresenter';
import '../../styles/tailwind.css';

export function AboutPage() {
    const presenter = new AboutPresenter();
    const info = presenter.getInfo();

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h2 className="text-2xl font-bold mb-4">Tentang GetPinjol</h2>
            <p>{info.description}</p>
            <p className="mt-2">Kontak: {info.contact}</p>
        </div>
    );
}