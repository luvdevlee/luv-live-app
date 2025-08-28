import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Logger,
  UseInterceptors,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { environmentVariablesConfig } from '@src/config/app.config';
import { User } from '@src/user/schemas/user.schema';
import type { Response, Request } from 'express';

@Controller('auth')
@UseGuards(ThrottlerGuard)
@UseInterceptors()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {
    this.logger.log('Initiating Google OAuth flow');
    // Guard redirects to Google OAuth
    // This endpoint is protected by GoogleAuthGuard which handles the redirect
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    try {
      this.logger.log('Google OAuth callback received');

      // Validate request
      if (!req.user) {
        this.logger.error('No user data received from Google OAuth callback');
        throw new BadRequestException('No user data received from Google');
      }

      // Process Google login
      const authResponse = await this.authService.googleLogin(req.user);

      // Create secure redirect URL with tokens
      const redirectUrl = this.buildSuccessRedirectUrl(
        authResponse.accessToken,
        authResponse.refreshToken,
      );

      this.logger.log(
        `Redirecting user to: ${environmentVariablesConfig.frontendUrl}`,
      );

      // Set secure cookies (optional additional security)
      this.setSecureCookies(
        res,
        authResponse.accessToken,
        authResponse.refreshToken,
      );

      return res.status(HttpStatus.FOUND).redirect(redirectUrl);
    } catch (error) {
      this.logger.error('Google OAuth callback error:', error.message);

      const errorRedirectUrl = this.buildErrorRedirectUrl(
        error.message || 'Authentication failed',
      );

      return res.status(HttpStatus.FOUND).redirect(errorRedirectUrl);
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: User, @Res() res: Response) {
    try {
      await this.authService.logout(user._id);

      this.logger.log(`User ${user.email} logged out successfully`);

      // Clear cookies if they were set
      this.clearCookies(res);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      this.logger.error('Logout error:', error.message);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    try {
      return {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          role: user.role,
          last_login_at: user.last_login_at,
          created_at: user.created_at,
        },
      };
    } catch (error) {
      this.logger.error('Get profile error:', error.message);
      throw new HttpException(
        'Failed to get profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh')
  @Public()
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }

      const authResponse = await this.authService.refreshTokens(refreshToken);

      // Set new secure cookies
      this.setSecureCookies(
        res,
        authResponse.accessToken,
        authResponse.refreshToken,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
        user: authResponse.user,
      });
    } catch (error) {
      this.logger.error('Token refresh error:', error.message);

      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message || 'Token refresh failed',
      });
    }
  }

  private buildSuccessRedirectUrl(
    accessToken: string,
    refreshToken: string,
  ): string {
    const baseUrl = environmentVariablesConfig.frontendUrl;
    const params = new URLSearchParams({
      accessToken,
      refreshToken,
      success: 'true',
      timestamp: Date.now().toString(), // Add timestamp for cache busting
    });

    return `${baseUrl}/auth/callback?${params.toString()}`;
  }

  private buildErrorRedirectUrl(errorMessage: string): string {
    const baseUrl = environmentVariablesConfig.frontendUrl;
    const params = new URLSearchParams({
      error: errorMessage,
      success: 'false',
      timestamp: Date.now().toString(),
    });

    return `${baseUrl}/auth/callback?${params.toString()}`;
  }

  private setSecureCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    // Set secure HTTP-only cookies as additional security measure
    const isProduction = environmentVariablesConfig.nodeEnv === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction, // Only send over HTTPS in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh',
    });
  }

  private clearCookies(res: Response): void {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/auth/refresh' });
  }
}
