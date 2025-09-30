import { User } from '../models/user.model';
import { Wallet } from '../models/wallet.model';
import { config } from '../config/env';

export const seedAdminUser = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user from config
    const admin = await User.create({
      name: config.superAdmin.name,
      email: config.superAdmin.email,
      password: config.superAdmin.password,
      role: 'admin',
    });

    // Create wallet for admin
    const wallet = await Wallet.create({ owner: admin._id });

    // Update admin with wallet reference
    admin.wallet = wallet._id;
    await admin.save();

    console.log('Super Admin user seeded successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error; // Let the server handle the error
  }
};