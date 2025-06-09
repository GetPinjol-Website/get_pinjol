import React from 'react';

const Navbar = () => {
  const role = localStorage.getItem('role') || 'guest';
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        {role === 'admin' && <li><a href="/admin-dashboard" className="hover:underline">Admin Dashboard</a></li>}
        {role === 'user' && <li><a href="/dashboard" className="hover:underline">User Dashboard</a></li>}
        <li><a href="/education" className="hover:underline">Education</a></li>
        <li><a href="/report" className="hover:underline">Reports</a></li>
        <li><a href="/about" className="hover:underline">About</a></li>
        {role === 'guest' ? (
          <>
            <li><a href="/login" className="hover:underline">Login</a></li>
            <li><a href="/register" className="hover:underline">Register</a></li>
          </>
        ) : (
          <li><a href="#" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); window.location.href = '/'; }} className="hover:underline">Logout</a></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;