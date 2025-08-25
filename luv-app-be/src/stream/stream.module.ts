import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamService } from './stream.service';
import { StreamResolver } from './stream.resolver';
import { Stream, StreamSchema } from './schemas/stream.schema';
import { StreamerModule } from '../streamer/streamer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stream.name, schema: StreamSchema }]),
    StreamerModule,
  ],
  providers: [StreamService, StreamResolver],
  exports: [StreamService],
})
export class StreamModule {}
