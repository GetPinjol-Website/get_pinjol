'use strict';

const Education = require('../models/education');
const { nanoid } = require('nanoid');

const createEducation = async (request, h) => {
  try {
    const { title, content, date, category } = request.payload;
    if (!title || !content || !date) {
      return h.response({ status: 'gagal', pesan: 'Judul, konten, dan tanggal wajib diisi' }).code(400);
    }

    const newEducation = new Education({ id: nanoid(10), title, content, date, category });
    await newEducation.save();
    return h.response({ status: 'sukses', pesan: 'Edukasi berhasil dibuat', data: newEducation }).code(201);
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
  }
};

const getAllEducation = async (request, h) => {
  try {
    const { title, category } = request.query;
    let query = {};
    if (title) query.title = new RegExp(title, 'i');
    if (category) query.category = category;

    const educations = await Education.find(query).sort({ date: -1 }); // Urutkan berdasarkan tanggal terbaru
    return h.response({ status: 'sukses', data: educations }).code(200);
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
  }
};

const getEducationById = async (request, h) => {
  try {
    const { id } = request.params;
    const education = await Education.findOne({ id });
    if (!education) {
      return h.response({ status: 'gagal', pesan: 'Edukasi tidak ditemukan' }).code(404);
    }
    return h.response({ status: 'sukses', data: education }).code(200);
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
  }
};

const updateEducation = async (request, h) => {
  try {
    const { id } = request.params;
    const { title, content, date, category } = request.payload;
    const education = await Education.findOne({ id });
    if (!education) {
      return h.response({ status: 'gagal', pesan: 'Edukasi tidak ditemukan' }).code(404);
    }
    if (!title || !content || !date) {
      return h.response({ status: 'gagal', pesan: 'Judul, konten, dan tanggal wajib diisi' }).code(400);
    }
    education.title = title;
    education.content = content;
    education.date = date;
    education.category = category;
    await education.save();
    return h.response({ status: 'sukses', pesan: 'Edukasi diperbarui' }).code(200);
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
  }
};

const deleteEducation = async (request, h) => {
  try {
    const { id } = request.params;
    const education = await Education.findOneAndDelete({ id });
    if (!education) {
      return h.response({ status: 'gagal', pesan: 'Edukasi tidak ditemukan' }).code(404);
    }
    return h.response({ status: 'sukses', pesan: 'Edukasi dihapus' }).code(200);
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
  }
};

module.exports = { createEducation, getAllEducation, getEducationById, updateEducation, deleteEducation };