import React, { useState } from 'react';
import RegisterPagePresenter from './presenter/RegisterPagePresenter';
import RegisterPageModel from './model/RegisterPageModel';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const presenter = new RegisterPagePresenter(new RegisterPageModel());

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    presenter.registerUser(formData);
  };

  return (
    <div className="min-h-screen bg-[#27391C] text-[#FFFDF6] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-[#1F7D53] p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Daftar</h2>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-2 mb-4 bg-[#FAF6E9] text-[#18230F] rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
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
          Daftar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;