import { Module } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthResolver } from '@src/auth/auth.resolver';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
