'use strict';

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerHandler = async (request, h) => {
  try {
    const { username, password, email, role = 'user' } = request.payload;
    console.log('Register payload:', { username, email, role }); // Logging
    if (!username || !password || !email) {
      return h.response({ status: 'gagal', pesan: 'Semua field wajib diisi' }).code(400).header('Cache-Control', 'no-store');
    }

    if (!emailRegex.test(email)) {
      return h.response({ status: 'gagal', pesan: 'Email tidak valid' }).code(400).header('Cache-Control', 'no-store');
    }

    if (role && !['admin', 'user'].includes(role)) {
      return h.response({ status: 'gagal', pesan: 'Role harus admin atau user' }).code(400).header('Cache-Control', 'no-store');
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return h.response({ status: 'gagal', pesan: 'Username atau email sudah ada' }).code(400).header('Cache-Control', 'no-store');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ id: nanoid(10), username, password: hashedPassword, email, role, updatedAt: new Date() });
    await newUser.save();

    return h.response({ status: 'sukses', pesan: 'Pengguna berhasil didaftarkan' }).code(201).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Register error:', error);
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const loginHandler = async (request, h) => {
  try {
    const { username, password } = request.payload;
    console.log('Login attempt:', { username }); // Logging
    if (!username || !password) {
      return h.response({ status: 'gagal', pesan: 'Username dan password wajib diisi' }).code(400).header('Cache-Control', 'no-store');
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return h.response({ status: 'gagal', pesan: 'Username atau password salah' }).code(401).header('Cache-Control', 'no-store');
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secret_key', { expiresIn: '1h' });
    console.log('Login success:', { username, role: user.role, token }); // Logging
    return h.response({ status: 'sukses', pesan: 'Login berhasil', token, role: user.role }).code(200).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Login error:', error);
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const getAllUsers = async (request, h) => {
  try {
    const { username, email } = request.query;
    let query = {};
    if (username) query.username = new RegExp(username, 'i');
    if (email) query.email = new RegExp(email, 'i');

    const users = await User.find(query).select('-password');
    if (users.length === 0) {
      return h.response({ status: 'gagal', pesan: 'Tidak bisa menemukan user' }).code(404)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `users-${Date.now()}`);
    }

    const lastModified = users.reduce((latest, user) => {
      return user.updatedAt > latest ? user.updatedAt : latest;
    }, new Date(0));

    return h.response({ status: 'sukses', data: users }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `users-${Date.now()}`)
      .header('Last-Modified', lastModified.toUTCString());
  } catch (error) {
    console.error('Get all users error:', error);
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const checkRoleHandler = async (request, h) => {
  try {
    const authHeader = request.headers.authorization;
    console.log('checkRole authHeader:', authHeader); // Logging
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return h.response({ status: 'gagal', pesan: 'Autentikasi diperlukan' }).code(401).header('Cache-Control', 'no-store');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    console.log('checkRole decoded:', decoded); // Logging
    if (!decoded) {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }

    const { role } = decoded;
    if (role === 'admin') {
      return h.response({ status: 'sukses', pesan: 'Anda adalah admin', role }).code(200)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `role-${decoded.id}`);
    } else if (role === 'user') {
      return h.response({ status: 'sukses', pesan: 'Anda adalah user', role }).code(200)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `role-${decoded.id}`);
    }
    return h.response({ status: 'gagal', pesan: 'Role tidak dikenali' }).code(400).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('checkRole error:', error);
    if (error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

module.exports = { registerHandler, loginHandler, getAllUsers, checkRoleHandler };