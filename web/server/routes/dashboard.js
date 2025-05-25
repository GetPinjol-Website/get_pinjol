const { getDashboardStats } = require('../controllers/dashboardController');

module.exports = [
    {
        method: 'GET',
        path: '/api/dashboard/stats',
        handler: getDashboardStats
    }
];