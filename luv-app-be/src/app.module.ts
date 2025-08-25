import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';

import { environmentVariablesConfig } from '@src/config/app.config';
import { StreamModule } from '@src/stream/stream.module';
import { StreamerModule } from '@src/streamer/streamer.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    MongooseModule.forRoot(environmentVariablesConfig.mongodbUri || ''),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,

      playground: false,
      introspection: environmentVariablesConfig.nodeEnv !== 'production',

      plugins: [
        ...(environmentVariablesConfig.nodeEnv !== 'production'
          ? [
              ApolloServerPluginLandingPageLocalDefault({
                embed: true,
                includeCookies: true,
              }),
            ]
          : []),
      ],

      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      formatError: (error) => {
        return {
          message: error.message,
          code: error.extensions?.code,
          path: error.path,
          ...(environmentVariablesConfig.nodeEnv === 'development' && {
            locations: error.locations,
            stack: error,
          }),
        };
      },

      // Security Configuration
      csrfPrevention: false, // Disable for development
      cache: 'bounded',
    }),

    UserModule,
    StreamerModule,
    StreamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
