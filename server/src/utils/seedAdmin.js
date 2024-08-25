const mongoose = require('mongoose');
const Admin = require('../models/admin.model');
const config = require('../config');
const bcrypt = require('bcryptjs');

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'cmusvha@email.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('cmusvha@email.com', 12);
    const newAdmin = new Admin({
      name: 'Admin User',
      email: 'cmusvha@email.com',
      password: hashedPassword,
      role: 'admin'
    });

    await newAdmin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();