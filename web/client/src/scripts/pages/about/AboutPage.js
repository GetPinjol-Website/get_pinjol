import React from 'react';
import { AboutPresenter } from './AboutPresenter';
import '../../styles/tailwind.css';

export function AboutPage() {
    const presenter = new AboutPresenter();
    const { description, contact } = presenter.getInfo();

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Tentang GetPinjol</h2>
            <p className="text-gray-600">{description}</p>
            <p className="mt-2 text-gray-600">Kontak: <a href={`mailto:${contact}`} className="text-blue-500 hover:underline">{contact}</a></p>
        </div>
    );
}