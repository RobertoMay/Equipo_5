import { Module } from '@nestjs/common';
import { StudentService } from '../service/student.service';
import { StudentController } from '../controller/student.controller';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
