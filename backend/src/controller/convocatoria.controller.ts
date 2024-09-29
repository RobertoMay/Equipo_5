import { Controller, Get, Post, Param, Body, Delete, Put } from '@nestjs/common';
import { ConvocatoriaService } from '../service/convocatoria.service';
import { ConvocatoriaDocument } from '../todos/document/convocatoria.document';

@Controller('api/calls')
export class ConvocatoriaController {
  constructor(private readonly convocatoriaService: ConvocatoriaService) {}

  @Get('/')
  async getAll() {
    return this.convocatoriaService.findAll();
  }

  @Get('/get/:id')
  async getById(@Param('id') id: string) {
    return this.convocatoriaService.findById(id);
  }

  @Post('/')
  async create(@Body() convocatoria: ConvocatoriaDocument) {
    return this.convocatoriaService.create(convocatoria);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() convocatoria: Partial<ConvocatoriaDocument>) {
    return this.convocatoriaService.update(id, convocatoria);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string) {
    return this.convocatoriaService.delete(id);
  }
}
