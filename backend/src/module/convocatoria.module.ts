import { Module } from '@nestjs/common';
import { ConvocatoriaService } from 'src/service/convocatoria.service';
import { FirestoreModule } from 'src/firestore/firestore.module';
import { ConvocatoriaController } from 'src/controller/convocatoria.controller';

@Module({
  imports: [FirestoreModule],
  providers: [ConvocatoriaService],
  controllers: [ConvocatoriaController],
  exports: [ConvocatoriaService],
})
export class ConvocatoriaModule {}
