import React from 'react';

const RegisterPage = ({ onSubmit }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={onSubmit} className="mt-4">
        <input type="text" name="username" placeholder="Username" className="border p-2 mb-2 w-full" />
        <input type="password" name="password" placeholder="Password" className="border p-2 mb-2 w-full" />
        <input type="email" name="email" placeholder="Email" className="border p-2 mb-2 w-full" />
        <select name="role" className="border p-2 mb-2 w-full">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
      </form>
      <p id="message" className="mt-2"></p>
    </div>
  );
};

export default RegisterPage;