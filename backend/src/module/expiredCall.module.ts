import { Module } from '@nestjs/common';
import { ExpiredStudentService } from 'src/service/expiredCall.service';
import { FirestoreModule } from 'src/firestore/firestore.module';
import { ExpiredStudentController } from 'src/controller/expiredCall.controller';

@Module({
  imports: [FirestoreModule],
  providers: [ExpiredStudentService],
  controllers: [ExpiredStudentController],
})
export class ExpiredCallModule {}
