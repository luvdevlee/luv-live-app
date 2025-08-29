import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    accessTokenTtl: process.env.JWT_ACCESS_TOKEN_TTL,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshTokenTtl: process.env.JWT_REFRESH_ACCESS_TOKEN_TTL,
  };
});
