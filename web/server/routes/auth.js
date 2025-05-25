const { login, register } = require('../controllers/authController');

module.exports = [
    {
        method: 'POST',
        path: '/api/auth/login',
        handler: login
    },
    {
        method: 'POST',
        path: '/api/auth/register',
        handler: register
    }
];