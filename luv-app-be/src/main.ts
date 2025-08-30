import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import helmet from 'helmet';
import compression from 'compression';
import { ConfigService } from '@nestjs/config';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );
  app.enableCors();

  app.use(compression());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(error => {
          const constraints = error.constraints;
          return {
            field: error.property,
            errors: Object.values(constraints ?? {}),
          };
        });
        
        return new BadRequestException({
          message: messages.map((m) => m.errors.join(', ')).join('; '),
        });
      },
    }),
  );

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  await app.listen(port);

  console.log(`🚀 GraphQL Playground: http://localhost:${port}/graphql`);
  console.log(`🎯 Application running on: http://localhost:${port}`);
}

void bootstrap();
