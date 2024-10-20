import { Module } from '@nestjs/common';
import { StudenDocService } from 'src/service/studentdoc.service';
import { FirestoreModule } from 'src/firestore/firestore.module';
import { StudentDocController } from 'src/controller/studentdoc.controller';

@Module({
  imports: [FirestoreModule],
  providers: [StudenDocService],
  controllers: [StudentDocController],
})
export class StudentDocModule {}
