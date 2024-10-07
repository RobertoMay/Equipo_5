import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreModule } from 'src/firestore/firestore.module';
import { InstitutionModule } from './institution.module';
import { ConvocatoriaModule } from './convocatoria.module';
import { AspiranteModule } from './aspirante.module';
import { BecarioModule } from './becario.module';
import { EnrollmentPeriodModule } from './enrollment-period.module';
import { StudentModule } from './student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        keyFilename: ConfigService.get<string>('SA_KEY'),
      }),
      inject: [ConfigService],
    }),

    InstitutionModule, AspiranteModule, ConvocatoriaModule, BecarioModule, EnrollmentPeriodModule, StudentModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
