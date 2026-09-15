import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend folder or root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pathpilot',
  jwtSecret: process.env.JWT_SECRET || 'dev-pathpilot-jwt-secret-key-change-in-prod-2025',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  claudeApiKey: process.env.CLAUDE_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  frontendUrl: process.env.NEXT_PUBLIC_API_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isTest: process.env.NODE_ENV === 'test',
  isProd: process.env.NODE_ENV === 'production',
};

export type Config = typeof config;
