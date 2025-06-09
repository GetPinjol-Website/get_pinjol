'use strict';

const Hapi = require('@hapi/hapi');
const connectDB = require('./config/db');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['http://localhost:5173'], 
        headers: ['Accept', 'Content-Type', 'Authorization', 'X-Requested-With'], 
        credentials: true,
        additionalHeaders: ['X-Requested-With'],
      },
    },
  });

  await connectDB();
  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();