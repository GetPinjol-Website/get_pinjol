'use strict';

const ReportWeb = require('../models/reportWeb');
const ReportApp = require('../models/reportApp');
const Application = require('../models/application');
const User = require('../models/user');
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

// Update Application counts and recommendation
const updateApplication = async (appName, type, level, status) => {
  try {
    let app = await Application.findOne({ name: appName, type });
    if (!app) {
      app = new Application({
        id: nanoid(10),
        name: appName,
        type,
        lowCount: 0,
        mediumCount: 0,
        highCount: 0,
        recommendation: 'Belum Diketahui',
        recommendationStatus: 'grey',
        updatedAt: new Date(),
      });
    }

    if (status === 'accepted') {
      if (level === 'low') app.lowCount += 1;
      else if (level === 'medium') app.mediumCount += 1;
      else if (level === 'high') app.highCount += 1;

      // Tentukan rekomendasi berdasarkan level
      if (app.lowCount > app.mediumCount && app.lowCount > app.highCount) {
        app.recommendation = 'Baik';
        app.recommendationStatus = 'green';
      } else if (app.mediumCount > app.lowCount && app.mediumCount > app.highCount) {
        app.recommendation = 'Cukup Baik';
        app.recommendationStatus = 'yellow';
      } else if (app.highCount > app.lowCount && app.highCount > app.mediumCount) {
        app.recommendation = 'Tidak Direkomendasikan';
        app.recommendationStatus = 'red';
      } else {
        app.recommendation = 'Netral';
        app.recommendationStatus = 'yellow';
      }
    }

    app.updatedAt = new Date();
    await app.save();
  } catch (error) {
    console.error('Error updating application:', error.message);
  }
};

// Create Report Web
const createReportWeb = async (request, h) => {
  try {
    const decoded = verifyToken(request.headers.authorization);
    const { appName, description, category, incidentDate, evidence, level } = request.payload;
    
    console.log('Received payload for createReportWeb:', { appName, description, category, incidentDate, evidence, level });

    if (!appName || !description || !category || !incidentDate) {
      console.log('Missing required fields:', { appName, description, category, incidentDate });
      return h.response({ status: 'gagal', pesan: 'Semua field kecuali evidence wajib diisi', missingFields: { appName, description, category, incidentDate } }).code(400).header('Cache-Control', 'no-store');
    }

    if (isNaN(Date.parse(incidentDate))) {
      console.log('Invalid incidentDate:', incidentDate);
      return h.response({ status: 'gagal', pesan: 'Tanggal insiden tidak valid', incidentDate }).code(400).header('Cache-Control', 'no-store');
    }

    if (!Array.isArray(category) || !category.length) {
      console.log('Invalid category:', category);
      return h.response({ status: 'gagal', pesan: 'Kategori harus berupa array non-kosong', category }).code(400).header('Cache-Control', 'no-store');
    }

    const newReport = new ReportWeb({
      id: nanoid(10),
      appName,
      description,
      category,
      incidentDate: new Date(incidentDate),
      evidence,
      userId: decoded.id,
      status: 'pending',
      level: level || 'low', // Gunakan level dari payload jika ada, default 'low'
      updatedAt: new Date(),
    });

    await newReport.save();
    console.log('Report saved:', newReport);
    return h.response({ status: 'sukses', pesan: 'Laporan web berhasil dibuat', data: newReport }).code(201).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Error in createReportWeb:', error.message, error);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.name === 'ValidationError') {
      return h.response({ status: 'gagal', pesan: 'Data tidak valid: ' + error.message, details: error.errors }).code(400).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'gagal', pesan: error.message || 'Kesalahan server internal', error: error.message }).code(400).header('Cache-Control', 'no-store');
  }
};

// Create Report App
const createReportApp = async (request, h) => {
  try {
    const decoded = verifyToken(request.headers.authorization);
    const { appName, description, category, incidentDate, evidence, level } = request.payload;

    console.log('Received payload for createReportApp:', { appName, description, category, incidentDate, evidence, level });

    if (!appName || !description || !category || !incidentDate) {
      console.log('Missing required fields:', { appName, description, category, incidentDate });
      return h.response({ status: 'gagal', pesan: 'Semua field kecuali evidence wajib diisi', missingFields: { appName, description, category, incidentDate } }).code(400).header('Cache-Control', 'no-store');
    }

    if (isNaN(Date.parse(incidentDate))) {
      console.log('Invalid incidentDate:', incidentDate);
      return h.response({ status: 'gagal', pesan: 'Tanggal insiden tidak valid', incidentDate }).code(400).header('Cache-Control', 'no-store');
    }

    if (!Array.isArray(category) || !category.length) {
      console.log('Invalid category:', category);
      return h.response({ status: 'gagal', pesan: 'Kategori harus berupa array non-kosong', category }).code(400).header('Cache-Control', 'no-store');
    }

    const newReport = new ReportApp({
      id: nanoid(10),
      appName,
      description,
      category,
      incidentDate: new Date(incidentDate),
      evidence,
      userId: decoded.id,
      status: 'pending',
      level: level || 'low', // Gunakan level dari payload jika ada, default 'low'
      updatedAt: new Date(),
    });

    await newReport.save();
    console.log('Report saved:', newReport);
    return h.response({ status: 'sukses', pesan: 'Laporan aplikasi berhasil dibuat', data: newReport }).code(201).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Error in createReportApp:', error.message, error);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.name === 'ValidationError') {
      return h.response({ status: 'gagal', pesan: 'Data tidak valid: ' + error.message, details: error.errors }).code(400).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'gagal', pesan: error.message || 'Kesalahan server internal', error: error.message }).code(400).header('Cache-Control', 'no-store');
  }
};

// Fungsi lain tetap sama
const getAllReports = async (request, h) => {
  try {
    const decoded = verifyToken(request.headers.authorization);
    const { appName, category, type } = request.query;
    let query = {};
    if (appName) query.appName = new RegExp(appName, 'i');
    if (category) query.category = category;

    let reports = [];
    let recommendation = 'Belum Diketahui';
    let recommendationStatus = 'grey';

    if (!type || type === 'web') {
      let webQuery = { ...query, status: 'accepted' };
      const webReports = await ReportWeb.find(webQuery).sort({ reportedAt: -1 }).populate('userId', 'username');
      reports = reports.concat(webReports);
    }
    if (!type || type === 'app') {
      let appQuery = { ...query, status: 'accepted' };
      const appReports = await ReportApp.find(appQuery).sort({ reportedAt: -1 }).populate('userId', 'username');
      reports = reports.concat(appReports);
    }

    if (reports.length === 0) {
      return h.response({ 
        status: 'sukses', 
        data: [], 
        recommendation,
        recommendationStatus
      }).code(200)
        .header('Cache-Control', 'public, max-age=1209600')
        .header('ETag', `reports-${Date.now()}`);
    }

    const app = await Application.findOne({ name: appName, type: type || 'web' });
    if (app) {
      recommendation = app.recommendation;
      recommendationStatus = app.recommendationStatus;
    }

    const formattedReports = reports.map(report => ({
      ...report.toObject(),
      type: report instanceof ReportApp ? 'app' : 'web',
      username: report.userId?.username || 'Tidak Diketahui',
      userId: report.userId?._id || report.userId
    }));

    const lastModified = reports.reduce((latest, report) => {
      return report.updatedAt > latest ? report.updatedAt : latest;
    }, new Date(0));

    return h.response({ 
      status: 'sukses', 
      data: formattedReports, 
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

const getAllReportsAdmin = async (request, h) => {
  try {
    const decoded = verifyToken(request.headers.authorization);
    if (decoded.role !== 'admin') {
      return h.response({ status: 'gagal', pesan: 'Hanya admin yang dapat mengakses laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }
    const { appName, category, type } = request.query;
    let query = {};
    if (appName) query.appName = new RegExp(appName, 'i');
    if (category) query.category = category;

    let reports = [];
    if (!type || type === 'web') {
      const webReports = await ReportWeb.find(query).sort({ reportedAt: -1 }).populate('userId', 'username');
      reports = reports.concat(webReports);
    }
    if (!type || type === 'app') {
      const appReports = await ReportApp.find(query).sort({ reportedAt: -1 }).populate('userId', 'username');
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
        .header('ETag', `reports-${Date.now()}`);
    }

    const formattedReports = reports.map(report => ({
      ...report.toObject(),
      type: report instanceof ReportApp ? 'app' : 'web',
      username: report.userId?.username || 'Tidak Diketahui',
      userId: report.userId?._id || report.userId
    }));

    const lastModified = reports.reduce((latest, report) => {
      return report.updatedAt > latest ? report.updatedAt : latest;
    }, new Date(0));

    return h.response({ 
      status: 'sukses', 
      data: formattedReports 
    }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `reports-${Date.now()}`)
      .header('Last-Modified', lastModified.toUTCString());
  } catch (error) {
    console.error('Error in getAllReportsAdmin:', error.message);
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

const getAllReportsByUser = async (request, h) => {
  try {
    const decoded = verifyToken(request.headers.authorization);
    const { type } = request.query;

    let reports = [];
    if (!type || type === 'web') {
      const webReports = await ReportWeb.find({ userId: decoded.id }).sort({ reportedAt: -1 }).populate('userId', 'username');
      reports = reports.concat(webReports);
    }
    if (!type || type === 'app') {
      const appReports = await ReportApp.find({ userId: decoded.id }).sort({ reportedAt: -1 }).populate('userId', 'username');
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

    const formattedReports = reports.map(report => ({
      ...report.toObject(),
      type: report instanceof ReportApp ? 'app' : 'web',
      username: report.userId?.username || 'Tidak Diketahui',
      userId: report.userId?._id || report.userId
    }));

    const lastModified = reports.reduce((latest, report) => {
      return report.updatedAt > latest ? report.updatedAt : latest;
    }, new Date(0));

    return h.response({ status: 'sukses', data: formattedReports }).code(200)
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

const getReportById = async (request, h) => {
  try {
    const { id } = request.params;
    const decoded = verifyToken(request.headers.authorization);

    let report = await ReportWeb.findOne({ id }).populate('userId', 'username');
    let type = 'web';
    if (!report) {
      report = await ReportApp.findOne({ id }).populate('userId', 'username');
      type = 'app';
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

    if (report.userId._id.toString() !== decoded.id && decoded.role !== 'admin') {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses ke laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }

    const formattedReport = {
      ...report.toObject(),
      type,
      username: report.userId?.username || 'Tidak Diketahui',
      userId: report.userId?._id || report.userId
    };

    return h.response({ status: 'sukses', data: formattedReport }).code(200)
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

const updateReportWeb = async (request, h) => {
  try {
    const { id } = request.params;
    const decoded = verifyToken(request.headers.authorization);
    const { appName, description, category, incidentDate, evidence, status, level } = request.payload;

    console.log('Received payload for updateReportWeb:', request.payload);

    const report = await ReportWeb.findOne({ id });
    if (!report) {
      return h.response({ status: 'gagal', pesan: 'Laporan web tidak ditemukan' }).code(404).header('Cache-Control', 'no-store');
    }

    if (decoded.role === 'admin') {
      if (!['accepted', 'rejected'].includes(status)) {
        return h.response({ status: 'gagal', pesan: 'Status harus accepted atau rejected' }).code(400).header('Cache-Control', 'no-store');
      }
      if (!['low', 'medium', 'high'].includes(level)) {
        return h.response({ status: 'gagal', pesan: 'Level harus low, medium, atau high' }).code(400).header('Cache-Control', 'no-store');
      }
      const updateData = {
        status,
        level,
        updatedAt: new Date(),
      };
      const updatedReport = await ReportWeb.findOneAndUpdate({ id }, updateData, { new: true }).populate('userId', 'username');
      if (status === 'accepted') {
        await updateApplication(report.appName, 'web', level, status);
      }
      const formattedReport = {
        ...updatedReport.toObject(),
        type: 'web',
        username: updatedReport.userId?.username || 'Tidak Diketahui',
        userId: updatedReport.userId?._id || updatedReport.userId
      };
      return h.response({ status: 'sukses', pesan: 'Status laporan web berhasil diperbarui', data: formattedReport }).code(200).header('Cache-Control', 'no-store');
    }

    if (report.userId !== decoded.id) {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses untuk mengedit laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }

    const updateData = {
      appName: appName || report.appName,
      description: description || report.description,
      category: category ? (Array.isArray(category) && category.length ? category : report.category) : report.category,
      incidentDate: incidentDate ? new Date(incidentDate) : report.incidentDate,
      evidence: evidence || report.evidence,
      updatedAt: new Date(),
    };

    if (incidentDate && isNaN(Date.parse(incidentDate))) {
      return h.response({ status: 'gagal', pesan: 'Tanggal insiden tidak valid', incidentDate }).code(400).header('Cache-Control', 'no-store');
    }

    if (category && (!Array.isArray(category) || !category.length)) {
      return h.response({ status: 'gagal', pesan: 'Kategori harus berupa array non-kosong', category }).code(400).header('Cache-Control', 'no-store');
    }

    const updatedReport = await ReportWeb.findOneAndUpdate({ id }, updateData, { new: true }).populate('userId', 'username');
    const formattedReport = {
      ...updatedReport.toObject(),
      type: 'web',
      username: updatedReport.userId?.username || 'Tidak Diketahui',
      userId: updatedReport.userId?._id || updatedReport.userId
    };
    return h.response({ status: 'sukses', pesan: 'Laporan web berhasil diperbarui', data: formattedReport }).code(200).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Error in updateReportWeb:', error.message, error);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.name === 'ValidationError') {
      return h.response({ status: 'gagal', pesan: 'Data tidak valid: ' + error.message, details: error.errors }).code(400).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal', error: error.message }).code(500).header('Cache-Control', 'no-store');
  }
};

const updateReportApp = async (request, h) => {
  try {
    const { id } = request.params;
    const decoded = verifyToken(request.headers.authorization);
    const { appName, description, category, incidentDate, evidence, status, level } = request.payload;

    console.log('Received payload for updateReportApp:', request.payload);

    const report = await ReportApp.findOne({ id });
    if (!report) {
      return h.response({ status: 'gagal', pesan: 'Laporan aplikasi tidak ditemukan' }).code(404).header('Cache-Control', 'no-store');
    }

    if (decoded.role === 'admin') {
      if (!['accepted', 'rejected'].includes(status)) {
        return h.response({ status: 'gagal', pesan: 'Status harus accepted atau rejected' }).code(400).header('Cache-Control', 'no-store');
      }
      if (!['low', 'medium', 'high'].includes(level)) {
        return h.response({ status: 'gagal', pesan: 'Level harus low, medium, atau high' }).code(400).header('Cache-Control', 'no-store');
      }
      const updateData = {
        status,
        level,
        updatedAt: new Date(),
      };
      const updatedReport = await ReportApp.findOneAndUpdate({ id }, updateData, { new: true }).populate('userId', 'username');
      if (status === 'accepted') {
        await updateApplication(report.appName, 'app', level, status);
      }
      const formattedReport = {
        ...updatedReport.toObject(),
        type: 'app',
        username: updatedReport.userId?.username || 'Tidak Diketahui',
        userId: updatedReport.userId?._id || updatedReport.userId
      };
      return h.response({ status: 'sukses', pesan: 'Status laporan aplikasi berhasil diperbarui', data: formattedReport }).code(200).header('Cache-Control', 'no-store');
    }

    if (report.userId !== decoded.id) {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses untuk mengedit laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }

    const updateData = {
      appName: appName || report.appName,
      description: description || report.description,
      category: category ? (Array.isArray(category) && category.length ? category : report.category) : report.category,
      incidentDate: incidentDate ? new Date(incidentDate) : report.incidentDate,
      evidence: evidence || report.evidence,
      updatedAt: new Date(),
    };

    if (incidentDate && isNaN(Date.parse(incidentDate))) {
      return h.response({ status: 'gagal', pesan: 'Tanggal insiden tidak valid', incidentDate }).code(400).header('Cache-Control', 'no-store');
    }

    if (category && (!Array.isArray(category) || !category.length)) {
      return h.response({ status: 'gagal', pesan: 'Kategori harus berupa array non-kosong', category }).code(400).header('Cache-Control', 'no-store');
    }

    const updatedReport = await ReportApp.findOneAndUpdate({ id }, updateData, { new: true }).populate('userId', 'username');
    const formattedReport = {
      ...updatedReport.toObject(),
      type: 'app',
      username: updatedReport.userId?.username || 'Tidak Diketahui',
      userId: updatedReport.userId?._id || updatedReport.userId
    };
    return h.response({ status: 'sukses', pesan: 'Laporan aplikasi berhasil diperbarui', data: formattedReport }).code(200).header('Cache-Control', 'no-store');
  } catch (error) {
    console.error('Error in updateReportApp:', error.message, error);
    if (error.message === 'Token tidak valid' || error.name === 'JsonWebTokenError') {
      return h.response({ status: 'gagal', pesan: 'Token tidak valid' }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.message === 'Autentikasi diperlukan') {
      return h.response({ status: 'gagal', pesan: error.message }).code(401).header('Cache-Control', 'no-store');
    }
    if (error.name === 'ValidationError') {
      return h.response({ status: 'gagal', pesan: 'Data tidak valid: ' + error.message, details: error.errors }).code(400).header('Cache-Control', 'no-store');
    }
    return h.response({ status: 'error', pesan: 'Kesalahan server internal', error: error.message }).code(500).header('Cache-Control', 'no-store');
  }
};

const deleteReportWeb = async (request, h) => {
  try {
    const { id } = request.params;
    const decoded = verifyToken(request.headers.authorization);

    const report = await ReportWeb.findOne({ id });
    if (!report) {
      return h.response({ status: 'gagal', pesan: 'Laporan web tidak ditemukan' }).code(404).header('Cache-Control', 'no-store');
    }

    if (report.userId !== decoded.id) {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses untuk menghapus laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }

    await ReportWeb.deleteOne({ id });
    return h.response({ status: 'sukses', pesan: id }).code(200).header('Cache-Control', 'no-store');
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

const deleteReportApp = async (request, h) => {
  try {
    const { id } = request.params;
    const decoded = verifyToken(request.headers.authorization);

    const report = await ReportApp.findOne({ id });
    if (!report) {
      return h.response({ status: 'gagal', pesan: 'Laporan aplikasi tidak ditemukan' }).code(404).header('Cache-Control', 'no-store');
    }

    if (report.userId !== decoded.id) {
      return h.response({ status: 'gagal', pesan: 'Anda tidak memiliki akses untuk menghapus laporan ini' }).code(403).header('Cache-Control', 'no-store');
    }

    await ReportApp.deleteOne({ id });
    return h.response({ status: 'sukses', pesan: id }).code(200).header('Cache-Control', 'no-store');
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

const getAllApplications = async (request, h) => {
  try {
    const decoded = verifyToken(request.headers.authorization);
    const { name, type } = request.query;
    let query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (type) query.type = type;

    const applications = await Application.find(query).sort({ updatedAt: -1 });

    return h.response({ status: 'sukses', data: applications }).code(200)
      .header('Cache-Control', 'public, max-age=1209600')
      .header('ETag', `applications-${Date.now()}`);
  } catch (error) {
    console.error('Error in getAllApplications:', error.message);
    return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
  }
};

module.exports = {
  createReportWeb,
  createReportApp,
  getAllReports,
  getAllReportsAdmin,
  getAllReportsByUser,
  getReportById,
  updateReportWeb,
  updateReportApp,
  deleteReportWeb,
  deleteReportApp,
  getAllApplications,
};