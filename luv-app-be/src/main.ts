import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import helmet from 'helmet';
import compression from 'compression';
import { environmentVariablesConfig } from '@src/config/app.config';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add session middleware
  app.use(
    session({
      secret: environmentVariablesConfig.jwtSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: environmentVariablesConfig.nodeEnv === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  // Security middlewares
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: [
            "'self'",
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `'unsafe-inline'`, 'https:'],
          styleSrc: [`'self'`, `'unsafe-inline'`, 'https:'],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
          connectSrc: [`'self'`, 'https:', 'wss:'],
        },
      },
    }),
  );

  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: environmentVariablesConfig.corsOrigin?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://studio.apollographql.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Apollo-Require-Preflight',
      'X-Apollo-Operation-Name',
      'X-Requested-With',
    ],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = environmentVariablesConfig.port;
  await app.listen(port);

  console.log(`🚀 GraphQL Playground: http://localhost:${port}/graphql`);
  console.log(`🎯 Application running on: http://localhost:${port}`);
}

void bootstrap();
