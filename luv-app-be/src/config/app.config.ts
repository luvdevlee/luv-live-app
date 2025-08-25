import dotenv from 'dotenv';
dotenv.config();

export const environmentVariablesConfig = {
  port: Number(process.env.PORT || ''),
  nodeEnv: process.env.NODE_ENV || '',
  mongodbUri: process.env.MONGODB_URI || '',
  corsOrigin: process.env.CORS_ORIGIN || '',
  devtoolsPort: Number(process.env.DEVTOOLS_PORT || ''),
};