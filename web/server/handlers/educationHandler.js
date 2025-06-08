'use strict';

const Education = require('../models/education');
const { nanoid } = require('nanoid');

const createEducation = async (request, h) => {
  try {
    const { title, content, date, category } = request.payload;
    if (!title || !content || !date) {
      return h.response({ status: 'gagal', pesan: 'Judul, konten, dan tanggal wajib diisi' }).code(400).header('Cache-Control', 'no-store');
    }

    const newEducation = new Education({ id: nanoid(10), title, content, date, category, updatedAt: new Date() });
    await newEducation.save();
    return h.response({ status: 'sukses', pesan: 'Edukasi berhasil dibuat', data: newEducation }).code(201).header('Cache-Control', 'no-store');
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const getAllEducation = async (request, h) => {
  try {
    const { title, category } = request.query;
    let query = {};
    if (title) query.title = new RegExp(title, 'i');
    if (category) query.category = category;

    const educations = await Education.find(query).sort({ date: -1 });
    if (educations.length === 0) {
      return h.response({ status: 'gagal', pesan: 'Data tidak ditemukan' }).code(404)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `educations-${Date.now()}`);
    }

    const lastModified = educations.reduce((latest, edu) => {
      return edu.updatedAt > latest ? edu.updatedAt : latest;
    }, new Date(0));

    return h.response({ status: 'sukses', data: educations }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `educations-${Date.now()}`)
      .header('Last-Modified', lastModified.toUTCString());
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const getEducationById = async (request, h) => {
  try {
    const { id } = request.params;
    const education = await Education.findOne({ id });
    if (!education) {
      return h.response({ status: 'gagal', pesan: 'Edukasi tidak ditemukan' }).code(404)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `education-${id}`);
    }
    return h.response({ status: 'sukses', data: education }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `education-${id}`)
      .header('Last-Modified', education.updatedAt.toUTCString());
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const updateEducation = async (request, h) => {
  try {
    const { id } = request.params;
    const { title, content, date, category } = request.payload;
    const education = await Education.findOne({ id });
    if (!education) {
      return h.response({ status: 'gagal', pesan: 'Edukasi tidak ditemukan' }).code(404).header('Cache-Control', 'no-store');
    }
    if (!title || !content || !date) {
      return h.response({ status: 'gagal', pesan: 'Judul, konten, dan tanggal wajib diisi' }).code(400).header('Cache-Control', 'no-store');
    }

    // Validasi data "salah" (contoh: date tidak valid)
    if (isNaN(Date.parse(date))) {
      return h.response({ status: 'gagal', pesan: 'Tanggal tidak valid' }).code(400).header('Cache-Control', 'no-store');
    }

    education.title = title;
    education.content = content;
    education.date = new Date(date);
    education.category = category;
    education.updatedAt = new Date();
    await education.save();
    return h.response({ status: 'sukses', pesan: 'Edukasi diperbarui' }).code(200).header('Cache-Control', 'no-store');
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const deleteEducation = async (request, h) => {
  try {
    const { id } = request.params;
    const education = await Education.findOneAndDelete({ id });
    if (!education) {
      return h.response({ status: 'gagal', pesan: 'Edukasi tidak ditemukan' }).code(404).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'sukses', pesan: 'Edukasi dihapus' }).code(200).header('Cache-Control', 'no-store');
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

module.exports = { createEducation, getAllEducation, getEducationById, updateEducation, deleteEducation };