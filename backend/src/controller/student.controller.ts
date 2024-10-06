import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
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
  async generateStudentPdfByAspiranteId(@Param('aspiranteId') aspiranteId: string) {
    const student = await this.studentService.getStudentByAspiranteId(aspiranteId);
    const pdfPath = await this.studentService.generatePdf(student);
    return { message: 'PDF generated successfully', pdfPath };
  }
}
