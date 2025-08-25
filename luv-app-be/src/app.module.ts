import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';

import { UserModule } from '@src/user/user.module';
import { environmentVariablesConfig } from '@src/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    MongooseModule.forRoot(environmentVariablesConfig.mongodbUri || ""),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,

      playground: false,
      introspection: environmentVariablesConfig.nodeEnv !== "production",

      plugins: [
        ...(environmentVariablesConfig.nodeEnv !== 'production' 
          ? [ApolloServerPluginLandingPageLocalDefault({ 
              embed: true,
              includeCookies: true 
            })]
          : []
        ),
      ],

      context: ({ req, res }) => ({ req, res }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}