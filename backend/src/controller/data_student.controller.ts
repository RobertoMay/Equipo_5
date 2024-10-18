import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DataStudentService } from 'src/service/data_student.service';
import { DataStudent } from 'src/todos/document/data_student.document';

@Controller('api/datastudents')
export class DataStudentController {
  constructor(private readonly dataStudentService: DataStudentService) {}

  /**
   * Obtener todos los DataStudents
   */
  @Get('/')
  async getAllDataStudents() {
    try {
      const dataStudents = await this.dataStudentService.findAll();
      return dataStudents;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtener un DataStudent por su ID
   * @param id - ID del DataStudent
   */
  @Get('/:id')
  async getDataStudentById(@Param('id') id: string) {
    try {
      const dataStudent = await this.dataStudentService.findById(id);
      return dataStudent;
    } catch (error) {
      throw new HttpException(
        { message: 'DataStudent not found' },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  @Get('/aspirante/:aspiranteId')
  async getByAspiranteId(@Param('aspiranteId') aspiranteId: string): Promise<DataStudent> {
    try {
      const dataStudent = await this.dataStudentService.findByAspiranteId(aspiranteId);
      if (!dataStudent) {
        throw new HttpException('DataStudent no encontrado', HttpStatus.NOT_FOUND);
      }
      return dataStudent;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  /**
   * Crear un nuevo DataStudent
   * @param data - Datos del DataStudent a crear
   */
  @Post('/')
  async createDataStudent(@Body() data: DataStudent) {
    try {
      const newDataStudent = await this.dataStudentService.create(data);
      return newDataStudent;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Actualizar un DataStudent existente
   * @param id - ID del DataStudent a actualizar
   * @param data - Datos actualizados del DataStudent
   */
  @Put('/:id')
  async updateDataStudent(
    @Param('id') id: string,
    @Body() data: Partial<DataStudent>,
  ) {
    try {
      await this.dataStudentService.update(id, data);
      return { message: 'DataStudent updated successfully' };
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Eliminar un DataStudent por su ID
   * @param id - ID del DataStudent a eliminar
   */
  @Delete('/:id')
  async deleteDataStudent(@Param('id') id: string) {
    try {
      await this.dataStudentService.delete(id);
      return { message: 'DataStudent deleted successfully' };
    } catch (error) {
      throw new HttpException(
        { message: 'DataStudent not found' },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
