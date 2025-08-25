import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthService } from '@src/auth/auth.service';
import { AuthResolver } from '@src/auth/auth.resolver';
import { AuthController } from '@src/auth/auth.controller';
import { UserModule } from '@src/user/user.module';
import { JwtStrategy } from '@src/auth/strategies/jwt.strategy';
import { GoogleStrategy } from '@src/auth/strategies/google.strategy';
import { environmentVariablesConfig } from '@src/config/app.config';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false, // Disable session for stateless JWT approach
    }),
    JwtModule.register({
      secret: environmentVariablesConfig.jwtSecret,
      signOptions: {
        expiresIn: environmentVariablesConfig.jwtExpiresIn,
        algorithm: 'HS256',
        issuer: 'luv-app-auth',
        audience: 'luv-app-api',
      },
      verifyOptions: {
        algorithms: ['HS256'],
        issuer: 'luv-app-auth',
        audience: 'luv-app-api',
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: environmentVariablesConfig.throttleTtl * 1000, // Convert to milliseconds
        limit: environmentVariablesConfig.throttleLimit,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthResolver, JwtStrategy, GoogleStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
