import dns from 'dns';
dns.setServers(['8.8.8.8']);

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not set. Add it to your .env file before running this script.');
  process.exit(1);
}

console.log('Connecting with authSource=admin...');
try {
  await mongoose.connect(uri);
  console.log('MongoDB Atlas Connected successfully!');
  await mongoose.connection.close();
  console.log('Connection closed.');
} catch (error) {
  console.error('Connection failed:', error);
}
process.exit(0);
