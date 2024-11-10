import { Controller, Get } from '@nestjs/common';
import { ExpiredStudentService } from 'src/service/expiredCall.service';

@Controller('expired-students')
export class ExpiredStudentController {
  constructor(private readonly expiredStudentService: ExpiredStudentService) {}

  // Endpoint para obtener el contador de días hasta la próxima ejecución automática
  @Get('days-until-next-run')
  getDaysUntilNextRun(): { daysUntilNextRun: number } {
    const daysUntilNextRun = this.expiredStudentService.getDaysUntilNextRun();
    return { daysUntilNextRun };
  }
  @Get('days-until-delete')
  async getDaysUntilDelete() {
    return this.expiredStudentService.getDaysUntilDelete();
  }
}
