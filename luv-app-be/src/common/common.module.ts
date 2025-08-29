import { Module } from '@nestjs/common';
import { BcryptService } from '@src/auth/bcrypt.service';

@Module({
  providers: [BcryptService],
  exports: [BcryptService],
})
export class CommonModule {}
