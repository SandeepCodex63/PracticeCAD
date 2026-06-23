require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedAdmin = require('./utils/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Connecting to database...');
    // 1.Connect MongoDB
    await connectDB();

    // 2.Seed Admin account if not exists
    await seedAdmin();

    // 3.Start Express server
    console.log('Starting server...');
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
