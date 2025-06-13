'use strict';

const { registerHandler, loginHandler, getAllUsers, checkRoleHandler } = require('./handlers/authHandler');
const { createEducation, getAllEducation, getEducationById, updateEducation, deleteEducation } = require('./handlers/educationHandler');
const { getPinjolPrediction, getAllPinjol } = require('./handlers/pinjolHandler');
const {
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
} = require('./handlers/reportHandler');
const User = require('./models/user');

const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
  },
  {
    method: 'GET',
    path: '/users',
    handler: getAllUsers,
  },
  {
    method: 'GET',
    path: '/user/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const user = await User.findOne({ id }).select('-password');
        if (!user) {
          return h.response({ status: 'gagal', pesan: 'Pengguna tidak ditemukan' }).code(404)
            .header('Cache-Control', 'public, max-age=3600')
            .header('ETag', `user-${id}`);
        }
        return h.response({ status: 'sukses', data: user }).code(200)
          .header('Cache-Control', 'public, max-age=3600')
          .header('ETag', `user-${id}`)
          .header('Last-Modified', user.updatedAt.toUTCString());
      } catch (error) {
        console.error('Error in getUserById:', error);
        return h.response({ status: 'error', pesan: 'Kesalahan server internal' }).code(500).header('Cache-Control', 'no-store');
      }
    },
  },
  {
    method: 'POST',
    path: '/education',
    handler: createEducation,
  },
  {
    method: 'GET',
    path: '/education',
    handler: getAllEducation,
  },
  {
    method: 'GET',
    path: '/education/{id}',
    handler: getEducationById,
  },
  {
    method: 'PUT',
    path: '/education/{id}',
    handler: updateEducation,
  },
  {
    method: 'DELETE',
    path: '/education/{id}',
    handler: deleteEducation,
  },
  {
    method: 'GET',
    path: '/pinjol',
    handler: getPinjolPrediction,
  },
  {
    method: 'GET',
    path: '/pinjols',
    handler: getAllPinjol,
  },
  {
    method: 'POST',
    path: '/report/web',
    handler: createReportWeb,
  },
  {
    method: 'POST',
    path: '/report/app',
    handler: createReportApp,
  },
  {
    method: 'GET',
    path: '/reports',
    handler: getAllReports,
  },
  {
    method: 'GET',
    path: '/reports/admin',
    handler: getAllReportsAdmin,
  },
  {
    method: 'GET',
    path: '/reports/user',
    handler: getAllReportsByUser,
  },
  {
    method: 'GET',
    path: '/report/{id}',
    handler: getReportById,
  },
  {
    method: 'PUT',
    path: '/report/web/{id}',
    handler: updateReportWeb,
  },
  {
    method: 'PUT',
    path: '/report/app/{id}',
    handler: updateReportApp,
  },
  {
    method: 'DELETE',
    path: '/report/web/{id}',
    handler: deleteReportWeb,
  },
  {
    method: 'DELETE',
    path: '/report/app/{id}',
    handler: deleteReportApp,
  },
  {
    method: 'GET',
    path: '/applications',
    handler: getAllApplications,
  },
  {
    method: 'GET',
    path: '/check-role',
    handler: checkRoleHandler,
  },
];

module.exports = routes;