'use strict';

const ReportWeb = require('../models/reportWeb');
const ReportApp = require('../models/reportApp');
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');

// Helper function untuk verifikasi token dan peran
const verifyToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Autentikasi diperlukan', { cause: { statusCode: 401 } });
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, 'secret_key');
    if (!decoded.id || !decoded.role) {
      console.error('Token tidak memiliki id atau role:', decoded);
      throw new Error('Token tidak valid: ID atau role pengguna tidak ditemukan');
    }
  } catch (error) {
    console.error('Error verifikasi token:', error.message);
    throw new Error('Token tidak valid', { cause: { statusCode: 401 } });
  }
  return decoded;
};

// Create Report Web
const createReportWeb = async (request, h) => {
  try {
    const decoded = verifyToken(request.headers.authorization);
    const { appName, description, category, incidentDate, evidence, level, reportType } = request.payload;

    if (!appName || !description || !category || !incidentDate || !level || !reportType) {
      return h.response({ status: 'gagal', pesan: 'Semua field kecuali evidence wajib diisi' }).code(400).header('Cache-Control', 'no-store');
    }

    if (isNaN(Date.parse(incidentDate))) {
      return h.response({ status: 'gagal', pesan: 'Tanggal insiden tidak valid' }).code(400).header('Cache-Control', 'no-store');
    }

    if (!['low', 'medium', 'high'].includes(level)) {
      return h.response({ status: 'gagal', pesan: 'Tingkat harus low, medium, atau high' }).code(400).header('Cache-Control', 'no-store');
    }

    if (!['positive', 'negative'].includes(reportType)) {
      return h.response({ status: 'gagal', pesan: 'Tipe laporan harus positive atau negative' }).code(400).header('Cache-Control', 'no-store');
    }

    const newReport = new ReportWeb({
      id: nanoid(10),
      appName,
      description,
      category,
      incidentDate: new Date(incidentDate),
      evidence,
      level,
      reportType,
      userId: decoded.id,
      status: 'pending',
      updatedAt: new Date(),
    });

    await newReport.save();
    return h.response({ status: 'sukses', pesan: 'Laporan web berhasil dibuat', data: newReport }).code(201).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Error in createReportWeb:', error.message);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.name === 'ValidationError') {
      return h.response({ status: 'gagal', pesan: 'Data tidak valid: ' + error.message }).code(400).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

// Create Report App
const createReportApp = async (request, h) => {
  try {
    const decoded = verifyToken(request.headers.authorization);
    const { appName, description, category, incidentDate, evidence, level, reportType } = request.payload;

    if (!appName || !description || !category || !incidentDate || !level || !reportType) {
      return h.response({ status: 'gagal', pesan: 'Semua field kecuali evidence wajib diisi' }).code(400).header('Cache-Control', 'no-store');
    }

    if (isNaN(Date.parse(incidentDate))) {
      return h.response({ status: 'gagal', pesan: 'Tanggal insiden tidak valid' }).code(400).header('Cache-Control', 'no-store');
    }

    if (!['low', 'medium', 'high'].includes(level)) {
      return h.response({ status: 'gagal', pesan: 'Tingkat harus low, medium, atau high' }).code(400).header('Cache-Control', 'no-store');
    }

    if (!['positive', 'negative'].includes(reportType)) {
      return h.response({ status: 'gagal', pesan: 'Tipe laporan harus positive atau negative' }).code(400).header('Cache-Control', 'no-store');
    }

    const newReport = new ReportApp({
      id: nanoid(10),
      appName,
      description,
      category,
      incidentDate: new Date(incidentDate),
      evidence,
      level,
      reportType,
      userId: decoded.id,
      status: 'pending',
      updatedAt: new Date(),
    });

    await newReport.save();
    return h.response({ status: 'sukses', pesan: 'Laporan aplikasi berhasil dibuat', data: newReport }).code(201).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Error in createReportApp:', error.message);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.name === 'ValidationError') {
      return h.response({ status: 'gagal', pesan: 'Data tidak valid: ' + error.message }).code(400).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

// Get All Reports (Web and App)
const getAllReports = async (request, h) => {
  try {
    const decoded = verifyToken(request.headers.authorization);
    const { appName, category, type } = request.query;
    let query = {};
    if (appName) query.appName = new RegExp(appName, 'i');
    if (category) query.category = category;

    let reports = [];
    let recommendation = 'Belum Diketahui';

    if (!type || type === 'web') {
      let webQuery = { ...query };
      if (decoded.role !== 'admin') {
        webQuery.status = 'accepted';
      }
      const webReports = await ReportWeb.find(webQuery).sort({ reportedAt: -1 });
      reports = reports.concat(webReports);
    }
    if (!type || type === 'app') {
      let appQuery = { ...query };
      if (decoded.role !== 'admin') {
        appQuery.status = 'accepted';
      }
      const appReports = await ReportApp.find(appQuery).sort({ reportedAt: -1 });
      reports = reports.concat(appReports);
    }

    if (reports.length === 0) {
      return h.response({ 
        status: 'sukses', 
        data: [], 
        recommendation,
        recommendationStatus: 'grey'
      }).code(200)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `reports-${Date.now()}`);
    }

    // Hitung rekomendasi berdasarkan laporan positif dan negatif
    const positiveReports = reports.filter(r => r.reportType === 'positive').length;
    const negativeReports = reports.filter(r => r.reportType === 'negative').length;

    if (positiveReports > negativeReports) {
      recommendation = 'Cukup Direkomendasikan';
      recommendationStatus = 'green';
    } else if (negativeReports > positiveReports) {
      recommendation = 'Tidak Direkomendasikan';
      recommendationStatus = 'red';
    } else {
      recommendation = 'Netral';
      recommendationStatus = 'yellow';
    }

    const lastModified = reports.reduce((latest, report) => {
      return report.updatedAt > latest ? report.updatedAt : latest;
    }, new Date(0));

    return h.response({ 
      status: 'sukses', 
      data: reports, 
      recommendation, 
      recommendationStatus 
    }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `reports-${Date.now()}`)
      .header('Last-Modified', lastModified.toUTCString());
  } catch (error) {
    console.error('Error in getAllReports:', error.message);
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

// Get All Reports by User ID
const getAllReportsByUser = async (request, h) => {
  try {
    const decoded = verifyToken(request.headers.authorization);
    const { type } = request.query;

    let reports = [];
    if (!type || type === 'web') {
      const webReports = await ReportWeb.find({ userId: decoded.id }).sort({ reportedAt: -1 });
      reports = reports.concat(webReports);
    }
    if (!type || type === 'app') {
      const appReports = await ReportApp.find({ userId: decoded.id }).sort({ reportedAt: -1 });
      reports = reports.concat(appReports);
    }

    if (reports.length === 0) {
      return h.response({ 
        status: 'sukses', 
        data: [], 
        recommendation: 'Belum Diketahui',
        recommendationStatus: 'grey'
      }).code(200)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `user-reports-${decoded.id}-${Date.now()}`);
    }

    const lastModified = reports.reduce((latest, report) => {
      return report.updatedAt > latest ? report.updatedAt : latest;
    }, new Date(0));

    return h.response({ status: 'sukses', data: reports }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `user-reports-${decoded.id}-${Date.now()}`)
      .header('Last-Modified', lastModified.toUTCString());
  } catch (error) {
    console.error('Error in getAllReportsByUser:', error.message);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

// Get Report by ID (Web or App)
const getReportById = async (request, h) => {
  try {
    const { id } = request.params;
    const decoded = verifyToken(request.headers.authorization);

    let report = await ReportWeb.findOne({ id });
    if (!report) {
      report = await ReportApp.findOne({ id });
    }

    if (!report) {
      return h.response({ 
        status: 'gagal', 
        pesan: 'Laporan tidak ditemukan',
        recommendation: 'Belum Diketahui',
        recommendationStatus: 'grey'
      }).code(404)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `report-${id}`);
    }

    if (report.userId !== decoded.id && decoded.role !== 'admin') {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses ke laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }

    return h.response({ status: 'sukses', data: report }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `report-${id}`)
      .header('Last-Modified', report.updatedAt.toUTCString());
  } catch (error) {
    console.error('Error in getReportById:', error.message);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

// Update Report Web
const updateReportWeb = async (request, h) => {
  try {
    const { id } = request.params;
    const decoded = verifyToken(request.headers.authorization);
    const { appName, description, category, incidentDate, evidence, status, level, reportType } = request.payload;

    const report = await ReportWeb.findOne({ id });
    if (!report) {
      return h.response({ status: 'gagal', pesan: 'Laporan web tidak ditemukan' }).code(404).header('Cache-Control', 'no-store');
    }

    if (report.userId !== decoded.id && decoded.role !== 'admin') {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses untuk mengedit laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }

    const updateData = {
      appName: appName || report.appName,
      description: description || report.description,
      category: category || report.category,
      incidentDate: incidentDate ? new Date(incidentDate) : report.incidentDate,
      evidence: evidence || report.evidence,
      status: status || report.status,
      level: level || report.level,
      reportType: reportType || report.reportType,
      updatedAt: new Date(),
    };

    if (incidentDate && isNaN(Date.parse(incidentDate))) {
      return h.response({ status: 'gagal', pesan: 'Tanggal insiden tidak valid' }).code(400).header('Cache-Control', 'no-store');
    }

    if (level && !['low', 'medium', 'high'].includes(level)) {
      return h.response({ status: 'gagal', pesan: 'Tingkat harus low, medium, atau high' }).code(400).header('Cache-Control', 'no-store');
    }

    if (reportType && !['positive', 'negative'].includes(reportType)) {
      return h.response({ status: 'gagal', pesan: 'Tipe laporan harus positive atau negative' }).code(400).header('Cache-Control', 'no-store');
    }

    const updatedReport = await ReportWeb.findOneAndUpdate({ id }, updateData, { new: true });
    return h.response({ status: 'sukses', pesan: 'Laporan web berhasil diperbarui', data: updatedReport }).code(200).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Error in updateReportWeb:', error.message);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.name === 'ValidationError') {
      return h.response({ status: 'gagal', pesan: 'Data tidak valid: ' + error.message }).code(400).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

// Update Report App
const updateReportApp = async (request, h) => {
  try {
    const { id } = request.params;
    const decoded = verifyToken(request.headers.authorization);
    const { appName, description, category, incidentDate, evidence, status, level, reportType } = request.payload;

    const report = await ReportApp.findOne({ id });
    if (!report) {
      return h.response({ status: 'gagal', pesan: 'Laporan aplikasi tidak ditemukan' }).code(404).header('Cache-Control', 'no-store');
    }

    if (report.userId !== decoded.id && decoded.role !== 'admin') {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses untuk mengedit laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }

    const updateData = {
      appName: appName || report.appName,
      description: description || report.description,
      category: category || report.category,
      incidentDate: incidentDate ? new Date(incidentDate) : report.incidentDate,
      evidence: evidence || report.evidence,
      status: status || report.status,
      level: level || report.level,
      reportType: reportType || report.reportType,
      updatedAt: new Date(),
    };

    if (incidentDate && isNaN(Date.parse(incidentDate))) {
      return h.response({ status: 'gagal', pesan: 'Tanggal insiden tidak valid' }).code(400).header('Cache-Control', 'no-store');
    }

    if (level && !['low', 'medium', 'high'].includes(level)) {
      return h.response({ status: 'gagal', pesan: 'Tingkat harus low, medium, atau high' }).code(400).header('Cache-Control', 'no-store');
    }

    if (reportType && !['positive', 'negative'].includes(reportType)) {
      return h.response({ status: 'gagal', pesan: 'Tipe laporan harus positive atau negative' }).code(400).header('Cache-Control', 'no-store');
    }

    const updatedReport = await ReportApp.findOneAndUpdate({ id }, updateData, { new: true });
    return h.response({ status: 'sukses', pesan: 'Laporan aplikasi berhasil diperbarui', data: updatedReport }).code(200).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Error in updateReportApp:', error.message);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.name === 'ValidationError') {
      return h.response({ status: 'gagal', pesan: 'Data tidak valid: ' + error.message }).code(400).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

// Delete Report Web
const deleteReportWeb = async (request, h) => {
  try {
    const { id } = request.params;
    const decoded = verifyToken(request.headers.authorization);

    const report = await ReportWeb.findOne({ id });
    if (!report) {
      return h.response({ status: 'gagal', pesan: 'Laporan web tidak ditemukan' }).code(404).header('Cache-Control', 'no-store');
    }

    if (report.userId !== decoded.id && decoded.role !== 'admin') {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses untuk menghapus laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }

    await ReportWeb.deleteOne({ id });
    return h.response({ status: 'sukses', pesan: 'Laporan web berhasil dihapus' }).code(200).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Error in deleteReportWeb:', error.message);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

// Delete Report App
const deleteReportApp = async (request, h) => {
  try {
    const { id } = request.params;
    const decoded = verifyToken(request.headers.authorization);

    const report = await ReportApp.findOne({ id });
    if (!report) {
      return h.response({ status: 'gagal', pesan: 'Laporan aplikasi tidak ditemukan' }).code(404).header('Cache-Control', 'no-store');
    }

    if (report.userId !== decoded.id && decoded.role !== 'admin') {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses untuk menghapus laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }

    await ReportApp.deleteOne({ id });
    return h.response({ status: 'sukses', pesan: 'Laporan aplikasi berhasil dihapus' }).code(200).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Error in deleteReportApp:', error.message);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

module.exports = {
  createReportWeb,
  createReportApp,
  getAllReports,
  getAllReportsByUser,
  getReportById,
  updateReportWeb,
  updateReportApp,
  deleteReportWeb,
  deleteReportApp,
};