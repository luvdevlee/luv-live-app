import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamerService } from './streamer.service';
import { StreamerResolver } from './streamer.resolver';
import { Streamer, StreamerSchema } from './schemas/streamer.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Streamer.name, schema: StreamerSchema },
    ]),
    UserModule,
  ],
  providers: [StreamerService, StreamerResolver],
  exports: [StreamerService],
})
export class StreamerModule {}
