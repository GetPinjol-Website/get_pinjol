'use strict';

const Pinjol = require('../models/pinjol');
const { nanoid } = require('nanoid');

const getPinjolPrediction = async (request, h) => {
  try {
    const { appName } = request.query;
    if (!appName) {
      return h.response({ status: 'gagal', pesan: 'Nama aplikasi wajib diisi' }).code(400);
    }

    const pinjol = await Pinjol.findOne({ appName });
    if (!pinjol) {
      return h.response({ status: 'gagal', pesan: 'Prediksi tidak tersedia' }).code(404);
    }
    return h.response({ status: 'sukses', data: pinjol }).code(200);
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
  }
};

const getAllPinjol = async (request, h) => {
  try {
    const { appName } = request.query;
    let query = {};
    if (appName) query.appName = new RegExp(appName, 'i');

    const pinjols = await Pinjol.find(query).sort({ updatedAt: -1 });
    return h.response({ status: 'sukses', data: pinjols }).code(200);
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
  }
};

module.exports = { getPinjolPrediction, getAllPinjol };