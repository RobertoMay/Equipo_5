import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreModule } from 'src/firestore/firestore.module'; // Importa el módulo de Firestore
import { InstitutionModule } from './institution.module';
import { ConvocatoriaModule } from './convocatoria.module';
import { AspiranteModule } from './aspirante.module';
import { StudentModule } from './student.module';

import { HojasinscripcionModule } from './hojasinscripcion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Configura el módulo de configuración como global
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule], // Asegúrate de importar el módulo de configuración aquí
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>('SA_KEY'), // Usa la clave del archivo de configuración
      }),
      inject: [ConfigService], // Inyecta el servicio de configuración
    }),
    // Importa todos los módulos necesarios
    InstitutionModule,
    AspiranteModule,
    ConvocatoriaModule,
    BecarioModule,
    EnrollmentPeriodModule,
    StudentModule,
    HojasinscripcionModule,
  ],
  controllers: [AppController], // Controladores de la aplicación
  providers: [AppService], // Servicios de la aplicación
})
export class AppModule {}
