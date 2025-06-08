import React, { useState } from 'react';
import LoginPage from './LoginPage.jsx';
import { login } from '../../utils/api.js';
import { saveData } from '../../utils/db.js';

const LoginPresenter = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      username: formData.get('username'),
      password: formData.get('password'),
    };
    try {
      const response = await login(credentials);
      await saveData('users', { id: Date.now().toString(), username: credentials.username });
      localStorage.setItem('role', response.role);
      window.location.href = '/dashboard';
    } catch (error) {
      setMessage(error.pesan || 'Error logging in');
    }
  };

  return <LoginPage onSubmit={handleSubmit} />;
};

export default LoginPresenter;