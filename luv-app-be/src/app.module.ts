import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

import { environmentVariablesConfig } from '@src/config/app.config';
import { AuthModule } from '@src/auth/auth.module';
import { StreamModule } from '@src/stream/stream.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    MongooseModule.forRoot(environmentVariablesConfig.mongodbUri!),

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium', 
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

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
      
      // Cải thiện error handling mà không cần custom filter
      formatError: (error) => {
        // Log error với context đơn giản
        console.error('GraphQL Error:', {
          message: error.message,
          path: error.path,
          code: error.extensions?.code,
          timestamp: new Date().toISOString(),
        });
        
        return {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_ERROR',
          // Không expose stack trace trong production
          ...(environmentVariablesConfig.nodeEnv === 'development' && {
            path: error.path,
            locations: error.locations,
          }),
        };
      },

      // Security Configuration
      csrfPrevention: false, // Disable for development
      cache: 'bounded',
    }),

    AuthModule,
    UserModule,
    StreamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
