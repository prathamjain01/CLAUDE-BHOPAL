import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export async function connectDB(): Promise<typeof mongoose | null> {
  if (isConnected) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: config.isDev,
    });

    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('[Database] MongoDB runtime error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('[Database] MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Warning: Could not connect to MongoDB at ${config.mongodbUri}. Backend will run with mock/hybrid storage for endpoints where DB is optional.`);
    if (config.isProd) {
      throw error;
    }
    return null;
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function disconnectDB(): Promise<void> {
  if (isConnected || mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[Database] Disconnected from MongoDB');
  }
}
