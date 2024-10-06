import { Module } from '@nestjs/common';
import { EnrollmentPeriodService } from '../service/enrollment-period.service';
import { EnrollmentPeriodController } from '../controller/enrollment-period.controller';

@Module({
  controllers: [EnrollmentPeriodController],
  providers: [EnrollmentPeriodService],
})
export class EnrollmentPeriodModule {}
