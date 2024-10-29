import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from '../service/admin.service';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/dashboard')
  async getDashboardData() {
    try {
      return await this.adminService.getDashboardData();
    } catch (error) {
      throw new HttpException(
        { message: 'Error al obtener datos del tablero', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
