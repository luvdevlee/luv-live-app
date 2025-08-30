import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';

import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { Environment } from '@src/common/enums/environment.enum';
import appConfig from '@src/common/config/app.config';
import databaseConfig from '@src/common/config/database.config';
import jwtConfig from '@src/common/config/jwt.config';
import { DatabaseModule } from '@src/database/mongodb.module';
import { CommonModule } from '@src/common/common.module';
import { JwtCommonModule } from '@src/common/modules/jwt-common.module';
import { AuthModule } from '@src/auth/auth.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, databaseConfig],
    }),
    DatabaseModule,
    CommonModule,
    JwtCommonModule,
    AuthModule,
    UserModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => ({
        message: error.message,
        code: error.extensions?.code || 'UNKNOWN_ERROR',
        status: error.extensions?.status || 500,
        timestamp: new Date().toISOString(),
        path: error.path,
        locations: error.locations,
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

