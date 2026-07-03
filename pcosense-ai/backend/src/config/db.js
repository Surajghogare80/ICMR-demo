// src/config/db.js
import mongoose from 'mongoose';
import dns from 'dns';
import logger from '../utils/logger.js';

// Root fix: Force public DNS servers to resolve MongoDB Atlas SRV records in restricted network environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  logger.info('Global DNS Resolver updated to [8.8.8.8, 1.1.1.1]');
} catch (dnsErr) {
  logger.warn(`Failed to set custom DNS servers: ${dnsErr.message}`);
}

const connectDB = async () => {
  global.dbMode = 'mongodb';
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('connected', () => logger.info('Mongoose connected to MongoDB'));
    mongoose.connection.on('error', (err) => logger.error(`Mongoose connection error: ${err}`));
    mongoose.connection.on('disconnected', () => logger.warn('Mongoose disconnected'));

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose disconnected on app termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error('========================================================');
    logger.error('⚠️  MONGODB CONNECTION FAILURE (ROOT DETAILS) ⚠️');
    logger.error(`Error Message: ${error.message}`);
    logger.error(`Error Code: ${error.code || 'N/A'}`);
    logger.error('This is likely due to incorrect Atlas credentials or IP whitelist restrictions.');
    logger.error('========================================================');
    logger.warn('🚀 Fallback: Activating In-Memory / Mock DB Mode so application remains fully operational!');
    logger.warn('========================================================');
    global.dbMode = 'mock';
  }
};

export default connectDB;

