import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleAuthGuard.name);

  constructor() {
    super({
      accessType: 'offline',
      prompt: 'consent',
      // Additional security options
      state: true, // Enable CSRF protection
      session: false, // Disable session for stateless JWT approach
    });
  }

  async canActivate(context: any): Promise<boolean> {
    this.logger.log('Google Auth Guard activated');

    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      this.logger.error(`Google Auth Guard failed: ${error.message}`);
      throw error;
    }
  }
}
