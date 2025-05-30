import React from 'react';
import LandingPagePresenter from './presenter/LandingPagePresenter';
import LandingPageModel from './model/LandingPageModel';

const LandingPage = () => {
  const presenter = new LandingPagePresenter(new LandingPageModel());

  return (
    <div className="min-h-screen bg-[#18230F] text-[#FFFDF6] flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">Selamat Datang di GetPinjol</h1>
      <p className="text-lg mb-6">Solusi aman untuk pinjaman online Anda.</p>
      <button
        onClick={() => presenter.navigateToRegister()}
        className="bg-[#1F7D53] text-[#FFFDF6] px-4 py-2 rounded hover:bg-[#255F38] transition"
      >
        Daftar Sekarang
      </button>
    </div>
  );
};

export default LandingPage;