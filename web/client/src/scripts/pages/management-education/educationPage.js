import React from 'react';
import ManagementEdukasiPresenter from './presenter/ManagementEdukasiPresenter';
import ManagementEdukasiModel from './model/ManagementEdukasiModel';

const ManagementEdukasiPage = () => {
  const presenter = new ManagementEdukasiPresenter(new ManagementEdukasiModel());
  const articles = presenter.getArticles();

  return (
    <div className="min-h-screen bg-[#255F38] text-[#FFFDF6] p-6">
      <h1 className="text-3xl font-bold mb-4">Manajemen Edukasi</h1>
      <ul className="bg-[#1F7D53] p-4 rounded">
        {articles.map((article, index) => (
          <li key={index} className="mb-2">{article.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManagementEdukasiPage;