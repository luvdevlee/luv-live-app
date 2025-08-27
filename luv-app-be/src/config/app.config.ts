import dotenv from 'dotenv';
dotenv.config();

export const environmentVariablesConfig = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  mongodbUri: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN,
  devtoolsPort: Number(process.env.DEVTOOLS_PORT),

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

  // Google OAuth Configuration
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,

  // Frontend Configuration
  frontendUrl: process.env.FRONTEND_URL,

  // Rate Limiting
  throttleTtl: Number(process.env.THROTTLE_TTL),
  throttleLimit: Number(process.env.THROTTLE_LIMIT),
};
