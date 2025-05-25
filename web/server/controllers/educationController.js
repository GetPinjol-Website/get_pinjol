const mongoose = require('mongoose');
const Education = mongoose.model('Education', new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
}));

exports.getArticles = async (request, h) => {
    try {
        const articles = await Education.find();
        return { data: articles };
    } catch (error) {
        return h.response({ error: 'Failed to fetch articles' }).code(500);
    }
};