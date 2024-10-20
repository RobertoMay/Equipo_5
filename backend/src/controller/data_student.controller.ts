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
import { createGenericController } from 'src/shared/generic.controller';


const endpoint = 'api/datastudents';


const GenericStudentDocController = createGenericController<DataStudent>(DataStudent.collectionName, endpoint);

@Controller(endpoint)
export class DataStudentController extends GenericStudentDocController {
  constructor(private readonly dataStudentService: DataStudentService) {
    super(); // Llama al constructor del controlador genérico
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
}
