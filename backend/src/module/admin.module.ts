import { Module } from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { AdminController } from '../controller/admin.controller';
import { AspiranteService } from '../service/aspirante.service';
import { ConvocatoriaService } from '../service/convocatoria.service';
import { StudenDocService } from '../service/studentdoc.service';
import { DataStudentService } from 'src/service/data_student.service';

@Module({
  imports: [],
  providers: [
    AdminService,
    AspiranteService,
    ConvocatoriaService,
    StudenDocService,
    DataStudentService
  ],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
