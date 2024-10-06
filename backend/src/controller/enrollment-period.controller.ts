import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { EnrollmentPeriodService } from '../service/enrollment-period.service';
import { EnrollmentPeriodDocument } from '../todos/document/enrollment-period.document';

@Controller('api/enrollment-period')
export class EnrollmentPeriodController {
  constructor(private readonly enrollmentPeriodService: EnrollmentPeriodService) {}

  // Obtener el periodo de inscripción actual
  @Get()
  async getEnrollmentPeriod() {
    try {
      const period = await this.enrollmentPeriodService.getEnrollmentPeriod();
      return period;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Obtener todas las fechas registradas
  @Get('all')
  async getAllEnrollmentPeriods() {
    try {
      const periods = await this.enrollmentPeriodService.getAllEnrollmentPeriods();
      return periods;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Crear o actualizar un periodo de inscripción
  @Post()
  async saveEnrollmentPeriod(@Body() data: Partial<EnrollmentPeriodDocument>) {
    try {
      const period = await this.enrollmentPeriodService.saveEnrollmentPeriod(data);
      return period;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  // Actualizar un periodo de inscripción por ID
  @Put(':id')
  async updateEnrollmentPeriod(@Param('id') id: string, @Body() data: Partial<EnrollmentPeriodDocument>) {
    try {
      const period = await this.enrollmentPeriodService.updateEnrollmentPeriod(id, data);
      return period;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  // Eliminar un periodo de inscripción por ID
  @Delete(':id')
  async deleteEnrollmentPeriod(@Param('id') id: string) {
    try {
      await this.enrollmentPeriodService.deleteEnrollmentPeriod(id);
      return { message: 'Enrollment period deleted successfully' };
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.NOT_FOUND);
    }
  }
}
