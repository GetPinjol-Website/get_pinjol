'use strict';

const Pinjol = require('../models/pinjol');
const { nanoid } = require('nanoid');

const getPinjolPrediction = async (request, h) => {
  try {
    const { appName } = request.query;
    if (!appName) {
      return h.response({ status: 'gagal', pesan: 'Nama aplikasi wajib diisi' }).code(400).header('Cache-Control', 'no-store');
    }

    const pinjol = await Pinjol.findOne({ appName });
    if (!pinjol) {
      return h.response({ status: 'gagal', pesan: 'Prediksi tidak tersedia' }).code(404)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `pinjol-${appName}`);
    }
    return h.response({ status: 'sukses', data: pinjol }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `pinjol-${appName}`)
      .header('Last-Modified', pinjol.updatedAt.toUTCString());
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const getAllPinjol = async (request, h) => {
  try {
    const { appName } = request.query;
    let query = {};
    if (appName) query.appName = new RegExp(appName, 'i');

    const pinjols = await Pinjol.find(query).sort({ updatedAt: -1 });
    if (pinjols.length === 0) {
      return h.response({ status: 'sukses', data: [] }).code(200)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `pinjols-${Date.now()}`);
    }

    const lastModified = pinjols.reduce((latest, pinjol) => {
      return pinjol.updatedAt > latest ? pinjol.updatedAt : latest;
    }, new Date(0));

    return h.response({ status: 'sukses', data: pinjols }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `pinjols-${Date.now()}`)
      .header('Last-Modified', lastModified.toUTCString());
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

module.exports = { getPinjolPrediction, getAllPinjol };