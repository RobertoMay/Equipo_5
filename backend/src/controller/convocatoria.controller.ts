import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConvocatoriaService } from '../service/convocatoria.service';
import { ConvocatoriaDocument } from '../todos/document/convocatoria.document';

@Controller('api/calls')
export class ConvocatoriaController {
  constructor(private readonly convocatoriaService: ConvocatoriaService) {}

  /**
   * Obtener la convocatoria activa actual
   */
  @Get('/status/')
  async getCurrentConvocatoria() {
    try {
      const convocatoria = await this.convocatoriaService.getCurrentConvocatoria();
      return {
        message: 'Convocatoria activa encontrada',
        convocatoria
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Error al obtener la convocatoria activa', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtener todas las convocatorias
   */
  @Get('/all')
  async getAllConvocatorias() {
    try {
      const convocatorias = await this.convocatoriaService.getAllConvocatorias();
      return {
        message: 'Todas las convocatorias obtenidas',
        convocatorias
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Error al obtener las convocatorias', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Crear una nueva convocatoria
   * @param data - Datos para crear la convocatoria (titulo, fecha de inicio, fecha de cierre, cupo)
   */
  @Post('/create')
  async saveConvocatoria(@Body() data: Partial<ConvocatoriaDocument>) {
    try {
      const convocatoria = await this.convocatoriaService.saveConvocatoria(data);
      return {
        message: 'Convocatoria creada exitosamente',
        convocatoria
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Error al crear la convocatoria', details: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  /**
   * Actualizar una convocatoria por ID
   * @param id - ID de la convocatoria a actualizar
   * @param data - Datos a actualizar (fecha de inicio, fecha de cierre, etc.)
   */
  @Put('/:id')
  async updateConvocatoria(@Param('id') id: string, @Body() data: Partial<ConvocatoriaDocument>) {
    const { startDate, endDate } = data;

    // Validación de fechas antes de proceder con la actualización
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        throw new HttpException('End date cannot be earlier than start date', HttpStatus.BAD_REQUEST);
      }
    }

    try {
      const updatedConvocatoria = await this.convocatoriaService.updateConvocatoria(id, data);
      return {
        message: 'Convocatoria actualizada exitosamente',
        updatedConvocatoria
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Error al actualizar la convocatoria', details: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Eliminar una convocatoria por ID
   * @param id - ID de la convocatoria a eliminar
   */
  @Delete('/:id')
  async deleteConvocatoria(@Param('id') id: string) {
    try {
      await this.convocatoriaService.delete(id);
      return { message: 'Convocatoria eliminada exitosamente' };
    } catch (error) {
      throw new HttpException(
        { message: 'Error al eliminar la convocatoria', details: error.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
