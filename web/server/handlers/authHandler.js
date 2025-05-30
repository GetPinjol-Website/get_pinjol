'use strict';

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerHandler = async (request, h) => {
  try {
    const { username, password, email } = request.payload;
    if (!username || !password || !email) {
      return h.response({ status: 'gagal', pesan: 'Semua field wajib diisi' }).code(400);
    }

    if (!emailRegex.test(email)) {
      return h.response({ status: 'gagal', pesan: 'Email tidak valid' }).code(400);
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return h.response({ status: 'gagal', pesan: 'Username atau email sudah ada' }).code(400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ id: nanoid(10), username, password: hashedPassword, email });
    await newUser.save();

    return h.response({ status: 'sukses', pesan: 'Pengguna berhasil didaftarkan' }).code(201);
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
  }
};

const loginHandler = async (request, h) => {
  try {
    const { username, password } = request.payload;
    if (!username || !password) {
      return h.response({ status: 'gagal', pesan: 'Username dan password wajib diisi' }).code(400);
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return h.response({ status: 'gagal', pesan: 'Username atau password salah' }).code(401);
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'secret_key', { expiresIn: '1h' });
    return h.response({ status: 'sukses', pesan: 'Login berhasil', token }).code(200);
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
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
      return h.response({ status: 'gagal', pesan: 'Tidak bisa menemukan user' }).code(404);
    }
    return h.response({ status: 'sukses', data: users }).code(200);
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
  }
};

module.exports = { registerHandler, loginHandler, getAllUsers };