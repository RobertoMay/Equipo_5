import { Module } from '@nestjs/common';
import { FirestoreModule } from '../firestore/firestore.module'; // Asegúrate de que el FirestoreModule esté correctamente configurado
import { AspiranteService } from '../service/aspirante.service';
import { AspiranteController } from '../controller/aspirante.controller';
import { ConvocatoriaModule } from './convocatoria.module';

@Module({
  imports: [FirestoreModule, ConvocatoriaModule], // Importa el módulo Firestore si lo necesitas para conectarte
  controllers: [AspiranteController], // Registra el controlador
  providers: [AspiranteService], // Registra el servicio
  
})
export class AspiranteModule {}
