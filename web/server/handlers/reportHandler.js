'use strict';

const ReportWeb = require('../models/reportWeb');
const ReportApp = require('../models/reportApp');
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');

const createReportWeb = async (request, h) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return h.response({ status: 'gagal', pesan: 'Autentikasi diperlukan' }).code(401).header('Cache-Control', 'no-store');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    if (!decoded) {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }

    const { appName, description, category, incidentDate, evidence } = request.payload;
    if (!appName || !description || !category || !incidentDate) {
      return h.response({ status: 'gagal', pesan: 'Semua field kecuali evidence wajib diisi' }).code(400).header('Cache-Control', 'no-store');
    }

    const newReport = new ReportWeb({ id: nanoid(10), appName, description, category, incidentDate, evidence, userId: decoded.id, updatedAt: new Date() });
    await newReport.save();
    return h.response({ status: 'sukses', pesan: 'Laporan berhasil dikirim', data: newReport }).code(201).header('Cache-Control', 'no-store');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const getTopReports = async (request, h) => {
  try {
    const reports = await ReportWeb.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const lastModified = new Date();
    return h.response({ status: 'sukses', data: reports }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `top-reports-${Date.now()}`)
      .header('Last-Modified', lastModified.toUTCString());
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const createReportApp = async (request, h) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return h.response({ status: 'gagal', pesan: 'Autentikasi diperlukan' }).code(401).header('Cache-Control', 'no-store');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    if (!decoded) {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }

    const { appName, description } = request.payload;
    if (!appName || !description) {
      return h.response({ status: 'gagal', pesan: 'Nama aplikasi dan deskripsi wajib diisi' }).code(400).header('Cache-Control', 'no-store');
    }

    const newReport = new ReportApp({ id: nanoid(10), appName, description, userId: decoded.id, updatedAt: new Date() });
    await newReport.save();
    return h.response({ status: 'sukses', pesan: 'Laporan berhasil dikirim', data: newReport }).code(201).header('Cache-Control', 'no-store');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const getReportById = async (request, h) => {
  try {
    const { id } = request.params;
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return h.response({ status: 'gagal', pesan: 'Autentikasi diperlukan' }).code(401).header('Cache-Control', 'no-store');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    if (!decoded) {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }

    const report = await ReportWeb.findOne({ id });
    if (!report) {
      return h.response({ status: 'gagal', pesan: 'Laporan tidak ditemukan' }).code(404)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `report-${id}`);
    }
    if (report.userId !== decoded.id) {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses ke laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'sukses', data: report }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `report-${id}`)
      .header('Last-Modified', report.updatedAt.toUTCString());
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const getAllReports = async (request, h) => {
  try {
    const { appName, category } = request.query;
    let query = {};
    if (appName) query.appName = new RegExp(appName, 'i');
    if (category) query.category = category;

    const reports = await ReportWeb.find(query).sort({ reportedAt: -1 });
    if (reports.length === 0) {
      return h.response({ status: 'sukses', data: [] }).code(200)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `reports-${Date.now()}`);
    }

    const lastModified = reports.reduce((latest, report) => {
      return report.updatedAt > latest ? report.updatedAt : latest;
    }, new Date(0));

    return h.response({ status: 'sukses', data: reports }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `reports-${Date.now()}`)
      .header('Last-Modified', lastModified.toUTCString());
  } catch (error) {
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

module.exports = { createReportWeb, getTopReports, createReportApp, getReportById, getAllReports };