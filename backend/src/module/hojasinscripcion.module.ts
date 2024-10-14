import { Module } from '@nestjs/common';
import { FirestoreModule } from 'src/firestore/firestore.module';
import { HojasInscripcionService } from '../service/hojasinscripcion.service';
import { HojasInscripcionController } from '../controller/hojasinscripcion.controller';
import { Storage } from '@google-cloud/storage';

@Module({
  imports: [FirestoreModule],
  providers: [HojasInscripcionService, Storage],
  controllers: [HojasInscripcionController],
})
export class HojasinscripcionModule {}
