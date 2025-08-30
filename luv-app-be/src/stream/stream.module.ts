import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamService } from './stream.service';
import { StreamResolver } from './stream.resolver';
import { Stream, StreamSchema } from './schemas/stream.schema';
import { CommonModule } from '@src/common/common.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stream.name, schema: StreamSchema }]),
    CommonModule,
    forwardRef(() => UserModule),
  ],
  providers: [StreamService, StreamResolver],
  exports: [StreamService],
})
export class StreamModule {}
