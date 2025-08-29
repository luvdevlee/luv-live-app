import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    nodeEnv: process.env.NODE_ENV || '',
    port: parseInt(process.env.PORT || '', 10),
  };
});
