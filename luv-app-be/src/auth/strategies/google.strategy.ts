import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { environmentVariablesConfig } from '@src/config/app.config';

export interface GoogleProfile {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  googleId: string;
  emailVerified: boolean;
  locale?: string;
  hd?: string; // Hosted domain for Google Workspace
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor() {
    super({
      clientID: environmentVariablesConfig.googleClientId!,
      clientSecret: environmentVariablesConfig.googleClientSecret!,
      callbackURL: environmentVariablesConfig.googleCallbackUrl!,
      scope: ['email', 'profile'],
      state: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      this.logger.log(`Validating Google profile for ID: ${profile.id}`);

      const { name, emails, photos, id, _json } = profile;

      // Enhanced validation
      if (!emails || !emails[0] || !emails[0].value) {
        this.logger.error('No email provided by Google OAuth');
        return done(
          new UnauthorizedException('Email not provided by Google'),
          undefined,
        );
      }

      if (!emails[0].verified) {
        this.logger.error('Email not verified by Google');
        return done(
          new UnauthorizedException('Email not verified by Google'),
          undefined,
        );
      }

      // Validate required profile fields
      if (!id || !name) {
        this.logger.error('Incomplete profile data from Google');
        return done(
          new UnauthorizedException('Incomplete profile data from Google'),
          undefined,
        );
      }

      const googleProfile: GoogleProfile = {
        email: emails[0].value,
        firstName: name?.givenName || '',
        lastName: name?.familyName || '',
        picture: photos?.[0]?.value || '',
        googleId: id,
        emailVerified: emails[0].verified || false,
        locale: _json?.locale,
        hd: _json?.hd, // Hosted domain for Google Workspace
      };

      this.logger.log(
        `Google profile validated successfully for: ${googleProfile.email}`,
      );
      done(null, googleProfile);
    } catch (error) {
      this.logger.error(`Google profile validation failed: ${error.message}`);
      done(error, undefined);
    }
  }
}
