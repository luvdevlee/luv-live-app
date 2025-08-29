import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => {
  return {
    origin: process.env.CORS_ORIGIN || '',
  };
});
