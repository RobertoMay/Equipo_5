import { Module } from '@nestjs/common';
import { AboutService } from '../service/about.service';
import { AboutController } from '../controller/about.controller';

@Module({
  providers: [AboutService],  // Registra el servicio
  controllers: [AboutController],  // Registra el controlador
  exports: [AboutService],  // Exporta el servicio para su uso en otros módulos, si es necesario
})
export class AboutModule {}
