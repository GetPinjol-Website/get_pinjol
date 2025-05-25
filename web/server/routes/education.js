const { getArticles } = require('../controllers/educationController');

module.exports = [
    {
        method: 'GET',
        path: '/api/education',
        handler: getArticles
    }
];