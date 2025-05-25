const Hapi = require('@hapi/hapi');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const educationRoutes = require('./routes/education');
const dashboardRoutes = require('./routes/dashboard');


const init = async () => {
    // Inisialisasi koneksi ke MongoDB Atlas
    await connectDB();

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // Gabungkan semua route
    server.route([
        ...authRoutes,
        ...educationRoutes,
        ...dashboardRoutes
    ]);


  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello, World!';
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();