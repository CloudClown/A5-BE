import mongoose from 'mongoose';
import { User } from '../src/app/models/user.model';
import { Wallet } from '../src/app/models/wallet.model';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-wallet');

    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@digitalwallet.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
    });

    // Create wallet for admin
    const wallet = await Wallet.create({ owner: admin._id });

    // Update admin with wallet reference
    admin.wallet = wallet._id;
    await admin.save();

    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();