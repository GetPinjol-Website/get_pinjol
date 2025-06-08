import React from 'react';

const LoginPage = ({ onSubmit }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={onSubmit} className="mt-4">
        <input type="text" name="username" placeholder="Username" className="border p-2 mb-2 w-full" />
        <input type="password" name="password" placeholder="Password" className="border p-2 mb-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
      </form>
      <p id="message" className="mt-2"></p>
    </div>
  );
};

export default LoginPage