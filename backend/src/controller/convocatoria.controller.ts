import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConvocatoriaService } from '../service/convocatoria.service';
import { ConvocatoriaDocument } from '../todos/document/convocatoria.document';

@Controller('api/calls')
export class ConvocatoriaController {
  constructor(private readonly convocatoriaService: ConvocatoriaService) {}

  @Get('/')
  async getCurrentConvocatoria() {
    try {
      const convocatoria = await this.convocatoriaService.getCurrentConvocatoria();
      return convocatoria;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('/all')
  async getAllConvocatorias() {
    try {
      return await this.convocatoriaService.getAllConvocatorias();
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Post('/')
  async saveConvocatoria(@Body() data: Partial<ConvocatoriaDocument>) {
    try {
      const convocatoria = await this.convocatoriaService.saveConvocatoria(data);
      return convocatoria;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('/:id')
  async updateConvocatoria(@Param('id') id: string, @Body() data: Partial<ConvocatoriaDocument>) {
    const { startDate, endDate } = data;
  
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      if (start > end) {
        throw new HttpException('End date cannot be earlier than start date', HttpStatus.BAD_REQUEST);
      }
    }
  
    try {
      return await this.convocatoriaService.updateConvocatoria(id, data);
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }
  
  @Delete('/:id')
  async deleteConvocatoria(@Param('id') id: string) {
    try {
      await this.convocatoriaService.delete(id);
      return { message: 'Convocatoria deleted successfully' };
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.NOT_FOUND);
    }
  }
}
