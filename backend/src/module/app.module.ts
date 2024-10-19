import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreModule } from 'src/firestore/firestore.module'; // Importa el módulo de Firestore
import { ConvocatoriaModule } from './convocatoria.module';
import { AspiranteModule } from './aspirante.module';
import { DataStudentModule } from './data_student.module';
import { StudentDocModule } from './studentdoc.module';
import { GenericController } from 'src/controller/generic.controller';
import { GenericService } from 'src/shared/generic.service';
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
    AspiranteModule,
    ConvocatoriaModule,
    DataStudentModule,
    StudentDocModule,
  ],
  controllers: [AppController, GenericController], // Controladores de la aplicación
  providers: [AppService, GenericService], // Servicios de la aplicación
})
export class AppModule {}
