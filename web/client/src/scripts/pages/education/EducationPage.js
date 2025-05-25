import React, { useState, useEffect } from 'react';
import { EducationPresenter } from './EducationPresenter';
import '../../styles/tailwind.css';

export function EducationPage() {
    const presenter = new EducationPresenter();
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        presenter.getArticles().then(setArticles);
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h2 className="text-2xl font-bold mb-4">Edukasi Pinjaman Online</h2>
            {articles.map((article) => (
                <div key={article.id} className="p-4 mb-4 bg-gray-100 rounded">
                    <h3 className="font-bold">{article.title}</h3>
                    <p>{article.content.substring(0, 100)}...</p>
                </div>
            ))}
        </div>
    );
}