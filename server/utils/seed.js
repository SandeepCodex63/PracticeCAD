const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      // Create admin user
      // User pre-save middleware will hash the password and ensure role = 'admin' / isVerified = true
      const adminUser = new User({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isVerified: true
      });
      
      await adminUser.save();
      console.log('--- Database Seeded: Admin User Created ---');
      console.log(`Email:    ${adminEmail}`);
      console.log('Password: [configured]');
      console.log('------------------------------------------');
    } else {
      console.log('Seeder: Admin user already exists. Skipping...');
    }
  } catch (error) {
    console.error('Seeder Error: Failed to seed admin user:', error.message);
  }
};

module.exports = seedAdmin;

// Allow direct CLI execution
if (require.main === module) {
  const connectDB = require('../config/db');
  require('dotenv').config();
  
  const runSeeder = async () => {
    try {
      await connectDB();
      await seedAdmin();
      console.log('Seeding process finished.');
      process.exit(0);
    } catch (err) {
      console.error('CLI Seeder Failed:', err.message);
      process.exit(1);
    }
  };
  runSeeder();
}

