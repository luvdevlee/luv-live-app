import dotenv from 'dotenv';
dotenv.config();

export const environmentVariablesConfig = {
  port: Number(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/luv-app',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  devtoolsPort: Number(process.env.DEVTOOLS_PORT || ''),

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Google OAuth Configuration
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '',

  // Frontend Configuration
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',

  // Rate Limiting
  throttleTtl: Number(process.env.THROTTLE_TTL || '60'),
  throttleLimit: Number(process.env.THROTTLE_LIMIT || '10'),
};
