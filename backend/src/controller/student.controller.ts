import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express'; // Asegúrate de importar Response desde express
import { StudentService } from '../service/student.service';
import { StudentDocument } from '../todos/document/student.document';

@Controller('api/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // Crear o actualizar estudiante con relación al aspirante
  @Put()
  async saveStudent(@Body() data: Partial<StudentDocument>) {
    return await this.studentService.saveStudent(data);
  }

  // Obtener estudiante por el ID del aspirante
  @Get('aspirante/:aspiranteId')
  async getStudentByAspiranteId(@Param('aspiranteId') aspiranteId: string) {
    return await this.studentService.getStudentByAspiranteId(aspiranteId);
  }

  // Generar PDF usando el ID del aspirante
  @Post('aspirante/:aspiranteId/generate-pdf')
  async generateStudentPdfByAspiranteId(
    @Param('aspiranteId') aspiranteId: string,
  ) {
    const student =
      await this.studentService.getStudentByAspiranteId(aspiranteId);
    const pdfPath = await this.studentService.generatePdf(student);
    return { message: 'PDF generated successfully', pdfPath };
  }
  // Endpoint para generar un PDF para un estudiante
  // Endpoint para generar un PDF para un estudiante
  // Generar un PDF con los datos del estudiante
  @Post('generate-pdf')
  async generateP(
    @Body() studentData: Partial<StudentDocument>,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Guardar los datos del estudiante en Firestore
      const student = await this.studentService.saveStudent(studentData);

      // Generar el PDF
      const pdfPath = await this.studentService.generatePdf(student);
      console.log(`PDF generado en: ${pdfPath}`);
      // Descargar el PDF generado
      res.download(pdfPath, `${student.id}_solicitud_ingreso.pdf`, (err) => {
        if (err) {
          res.status(500).send('No se pudo descargar el PDF');
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-lanzar la excepción si es una excepción HTTP
      }
      throw new HttpException(
        'Error al generar el PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
