require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/database');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await connectDB();

    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@example.com';
    const password = process.argv[4] || 'admin123';

    // Check if admin already exists
    const existing = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existing) {
      console.log('Admin user already exists!');
      await disconnectDB();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log(`Admin user created successfully!`);
    console.log(`ID: ${admin._id}`);
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    await disconnectDB();
    process.exit(1);
  }
};

createAdmin();
