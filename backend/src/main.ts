import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Permitir credenciales
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
