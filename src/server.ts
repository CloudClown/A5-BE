import mongoose from 'mongoose';
import { app } from './app';
import { config } from './app/config/env';
import { seedAdminUser } from './app/utils/seedAdmin';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url);
    console.log('Connected to MongoDB');

    // Seed admin user if none exists
    await seedAdminUser();

    // Start the server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
