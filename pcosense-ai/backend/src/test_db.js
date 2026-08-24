import dns from 'dns';
dns.setServers(['8.8.8.8']);

import mongoose from 'mongoose';

const uri = 'mongodb+srv://suraj:suraj123@icmrdemo.cauzwfy.mongodb.net/pmosense_ai?authSource=admin&retryWrites=true&w=majority&appName=ICMRdemo';

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
