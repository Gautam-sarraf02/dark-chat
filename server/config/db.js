import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/darkchat';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error(`[Database] MongoDB connection error:`, err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`[Database] MongoDB disconnected. Attempting to reconnect...`);
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log(`[Database] MongoDB reconnected successfully.`);
      isConnected = true;
    });

    return conn;
  } catch (error) {
    console.warn(`[Database] Warning: Could not connect to MongoDB (${error.message}). Running in fallback mode (real-time chat will function in-memory).`);
    isConnected = false;
    return null;
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
});
