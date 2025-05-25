const mongoose = require('mongoose');

async function setupDatabase() {
    try {
        await mongoose.connect('mongodb+srv://getpinjol:alardimuvi@cluster0.yysr1el.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const User = mongoose.model('User', new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, enum: ['user', 'admin'], default: 'user' },
            created_at: { type: Date, default: Date.now }
        }));

        const Education = mongoose.model('Education', new mongoose.Schema({
            title: { type: String, required: true },
            content: { type: String, required: true },
            author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            created_at: { type: Date, default: Date.now }
        }));

        // Inisialisasi data contoh
        await User.create({
            username: 'admin',
            email: 'admin@getpinjol.com',
            password: 'admin123', // Harus di-hash di produksi
            role: 'admin'
        });

        await Education.create({
            title: 'Cara Mengenali Pinjol Legal',
            content: 'Pastikan aplikasi terdaftar di OJK...',
            author_id: null // Akan diisi setelah ada user
        });

        console.log('Database initialized');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

setupDatabase();