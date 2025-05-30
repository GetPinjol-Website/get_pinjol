'use strict';

const { registerHandler, loginHandler, getAllUsers, checkRoleHandler } = require('./handlers/authHandler');
const { createEducation, getAllEducation, getEducationById, updateEducation, deleteEducation } = require('./handlers/educationHandler');
const { getPinjolPrediction, getAllPinjol } = require('./handlers/pinjolHandler');
const { createReportWeb, getTopReports, createReportApp, getReportById, getAllReports } = require('./handlers/reportHandler');

const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler
  },
  {
    method: 'GET',
    path: '/users',
    handler: getAllUsers
  },
  {
    method: 'GET',
    path: '/user/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const user = await User.findOne({ id }).select('-password');
        if (!user) {
          return h.response({ status: 'gagal', pesan: 'Pengguna tidak ditemukan' }).code(404);
        }
        return h.response({ status: 'sukses', data: user }).code(200);
      } catch (error) {
        return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500);
      }
    }
  },
  {
    method: 'POST',
    path: '/education',
    handler: createEducation
  },
  {
    method: 'GET',
    path: '/education',
    handler: getAllEducation
  },
  {
    method: 'GET',
    path: '/education/{id}',
    handler: getEducationById
  },
  {
    method: 'PUT',
    path: '/education/{id}',
    handler: updateEducation
  },
  {
    method: 'DELETE',
    path: '/education/{id}',
    handler: deleteEducation
  },
  {
    method: 'GET',
    path: '/pinjol',
    handler: getPinjolPrediction
  },
  {
    method: 'GET',
    path: '/pinjols',
    handler: getAllPinjol
  },
  {
    method: 'POST',
    path: '/report/web',
    handler: createReportWeb
  },
  {
    method: 'GET',
    path: '/report/top',
    handler: getTopReports
  },
  {
    method: 'POST',
    path: '/report/app',
    handler: createReportApp
  },
  {
    method: 'GET',
    path: '/report/{id}',
    handler: getReportById
  },
  {
    method: 'GET',
    path: '/reports',
    handler: getAllReports
  },
  {
    method: 'GET',
    path: '/check-role',
    handler: checkRoleHandler
  }
];

module.exports = routes;