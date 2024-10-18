import { Module } from '@nestjs/common';
import { DataStudentService } from 'src/service/data_student.service';
import { FirestoreModule } from 'src/firestore/firestore.module';
import { DataStudentController } from 'src/controller/data_student.controller';

@Module({
  imports: [FirestoreModule],
  providers: [DataStudentService],
  controllers: [DataStudentController],
})
export class DataStudentModule {}
