import React from 'react';
import ManagementUserPresenter from './presenter/ManagementUserPresenter';
import ManagementUserModel from './model/ManagementUserModel';

const ManagementUserPage = () => {
  const presenter = new ManagementUserPresenter(new ManagementUserModel());
  const users = presenter.getUsers();

  return (
    <div className="min-h-screen bg-[#27391C] text-[#FFFDF6] p-6">
      <h1 className="text-3xl font-bold mb-4">Manajemen Pengguna</h1>
      <ul className="bg-[#1F7D53] p-4 rounded">
        {users.map((user, index) => (
          <li key={index} className="mb-2">{user.username} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManagementUserPage;