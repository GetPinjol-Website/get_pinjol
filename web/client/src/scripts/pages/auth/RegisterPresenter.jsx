import React, { useState } from 'react';
import RegisterPage from './RegisterPage.jsx';
import { register } from '../../utils/api.js';
import { saveData } from '../../utils/db.js';

const RegisterPresenter = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      username: formData.get('username'),
      password: formData.get('password'),
      email: formData.get('email'),
      role: formData.get('role'),
    };
    try {
      const response = await register(userData);
      await saveData('users', { id: Date.now().toString(), ...userData });
      setMessage(response.pesan);
      localStorage.setItem('role', userData.role);
      window.location.href = '/dashboard';
    } catch (error) {
      setMessage(error.pesan || 'Error registering');
    }
  };

  return <RegisterPage onSubmit={handleSubmit} />;
};

export default RegisterPresenter;