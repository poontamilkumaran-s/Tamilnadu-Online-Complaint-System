const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/complaint_system';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    
    // Set connection options with short timeout so fallback triggers quickly if local MongoDB isn't active
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Initializing In-Memory Mongo Server fallback...`);
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      console.log(`In-Memory MongoDB Started at: ${uri}`);
      await mongoose.connect(uri);
      console.log('MongoDB Connected to In-Memory Instance successfully!');
    } catch (memErr) {
      console.error(`Failed to start In-Memory Mongo instance: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
