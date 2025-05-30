import React, { useState } from 'react';
import LoginPagePresenter from './presenter/LoginPagePresenter';
import LoginPageModel from './model/LoginPageModel';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const presenter = new LoginPagePresenter(new LoginPageModel());

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    presenter.loginUser(formData);
  };

  return (
    <div className="min-h-screen bg-[#255F38] text-[#FFFDF6] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-[#1F7D53] p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Masuk</h2>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-2 mb-4 bg-[#FAF6E9] text-[#18230F] rounded"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 mb-4 bg-[#FAF6E9] text-[#18230F] rounded"
        />
        <button type="submit" className="w-full bg-[#255F38] text-[#FFFDF6] p-2 rounded hover:bg-[#1F7D53]">
          Masuk
        </button>
      </form>
    </div>
  );
};

export default LoginPage;