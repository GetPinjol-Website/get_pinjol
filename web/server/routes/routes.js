const authRoutes = require('./auth');
const educationRoutes = require('./education');
const dashboardRoutes = require('./dashboard');

module.exports = [
    ...authRoutes,
    ...educationRoutes,
    ...dashboardRoutes
];