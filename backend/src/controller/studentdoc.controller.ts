import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  HttpStatus,
  HttpCode,

} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudenDocService } from '../service/studentdoc.service';
import { StudentDocDocument } from 'src/todos/document/studentdoc.document';
import { Buffer } from 'buffer';



@Controller('api/studentdoc')
export class StudentDocController {
  constructor(private readonly studentdocService: StudenDocService) {}

 
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() studentDocData: StudentDocDocument): Promise<StudentDocDocument> {
    // Validación de los datos recibidos
    if (!studentDocData) {
      throw new BadRequestException('Los datos del documento son requeridos');
    }

    // Usar el servicio genérico para crear un nuevo documento
    return this.studentdocService.create(studentDocData);
  }

  @Post('/add-document')
  @UseInterceptors(FileInterceptor('file'))
  async addDocumentToAspirante(
    @Body('aspiranteId') aspiranteId: string,
    @Body('documentType') documentType: string,
    @Body('documentName') documentName: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    try {
      // Verificar si el archivo se ha subido correctamente
      if (!file || !file.buffer) {
        throw new BadRequestException(
          'No se ha proporcionado un archivo válido.',
        );
      }

      // Llamar al método para añadir el documento al aspirante
      await this.studentdocService.addDocumentToAspirante(
        aspiranteId,
        file.buffer,
        documentType,
        documentName,
      );
    } catch (error) {
      console.error('Error al añadir el documento al aspirante:', error);

      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error interno al intentar añadir el documento. Por favor, inténtelo de nuevo más tarde.',
        );
      }
    }
  }

  @Get('/documents/:aspiranteId')
  async getDocumentsByAspiranteId(
    @Param('aspiranteId') aspiranteId: string,
  ): Promise<any[]> {
    try {
      const documents =
        await this.studentdocService.getDocumentsByAspiranteId(aspiranteId);
      return documents;
    } catch (error) {
      console.error('Error al obtener documentos del aspirante:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error('Error al recuperar los documentos del aspirante.');
    }
  }

  @Put('/update-status/:aspiranteId')
  async updateDocumentStatus(
    @Param('aspiranteId') aspiranteId: string,
    @Body() body: { link: string; status: 'accepted' | 'rejected' | 'pending' },
  ) {
    const { link, status } = body;

    try {
      await this.studentdocService.updateDocumentStatus(
        aspiranteId,
        link,
        status,
      );
      return { message: 'Se ha actualizado correctamente el Status del Documento' };
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put('/enrollment-status/:aspiranteId')
  async updateEnrollmentStatus(
    @Param('aspiranteId') aspiranteId: string,
    @Body('enrollmentStatus') enrollmentStatus: boolean,
  ) {
    try {
      await this.studentdocService.updateEnrollmentStatus(aspiranteId, enrollmentStatus);
      return { message: 'Status del Aspirante actualizado correctamente' };
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
