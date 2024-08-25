const mongoose = require('mongoose');
const Admin = require('../models/admin.model');
const config = require('../config');

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAdmin = async () => {
  try {
    await Admin.deleteMany({});
    console.log("Cleared existing admin users");

    const newAdmin = new Admin({
      name: 'Admin User',
      email: 'admin@gmail.com',
      role: 'admin'
    });

    newAdmin.setPassword('password123');

    const savedAdmin = await newAdmin.save();
    console.log('Admin user created successfully');
    console.log('Saved admin details:', {
      id: savedAdmin._id,
      email: savedAdmin.email
    });

    // Verify the password immediately after saving
    const isPasswordCorrect = savedAdmin.validPassword('password123');
    console.log("Immediate password verification result:", isPasswordCorrect);

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();