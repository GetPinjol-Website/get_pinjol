const mongoose = require('mongoose');
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    created_at: { type: Date, default: Date.now }
}));

exports.login = async (request, h) => {
    const { username, password } = request.payload;
    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            return h.response({ error: 'Invalid credentials' }).code(401);
        }
        return { message: 'Login successful', user: { id: user._id, username: user.username, role: user.role } };
    } catch (error) {
        return h.response({ error: 'Database error' }).code(500);
    }
};

exports.register = async (request, h) => {
    const { username, email, password } = request.payload;
    try {
        const user = new User({ username, email, password });
        await user.save();
        return { message: 'Registration successful' };
    } catch (error) {
        return h.response({ error: 'Registration failed' }).code(400);
    }
};