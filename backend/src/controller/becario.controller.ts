import { Controller, Get, Post, Param, Body, Delete, Put } from '@nestjs/common';
import { BecarioService } from '../service/becario.service';
import { BecarioDocument } from '../todos/document/becario.document';

@Controller('api/becario')
export class BecarioController {
  constructor(private readonly becarioService: BecarioService) {}

  @Get('/obtenerBecarios')
  async getAll() {
    return this.becarioService.findAll();
  }

  @Get('/obtenerBecario/:id')
  async getById(@Param('id') id: string) {
    return this.becarioService.findById(id);
  }

  @Post('/crearBecario')
  async create(@Body() becario: BecarioDocument) {
    return this.becarioService.create(becario);
  }

  @Put('/actualizarBecario/:id')
  async update(@Param('id') id: string, @Body() becario: Partial<BecarioDocument>) {
    return this.becarioService.update(id, becario);
  }

  @Delete('/eliminarBecario/:id')
  async delete(@Param('id') id: string) {
    return this.becarioService.delete(id);
  }
}
