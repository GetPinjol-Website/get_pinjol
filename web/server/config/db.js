const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://getpinjol:alardimuvi@cluster0.yysr1el.mongodb.net/", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;