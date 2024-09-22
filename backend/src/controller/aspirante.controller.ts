import { Controller, Post, Put, Delete, Get, Param, Body, HttpException, HttpStatus, Response, Res, ConflictException, InternalServerErrorException} from '@nestjs/common';
import { AspiranteService } from '../service/aspirante.service';
import { Aspirante } from '../module/aspirante.model';
import { AspiranteDocument } from 'src/todos/document/aspirante.document';
import { Response as ExpressResponse } from 'express';
import * as jwt from 'jsonwebtoken';
@Controller('')
export class AspiranteController {
  constructor(private readonly aspiranteService: AspiranteService) {}

  @Post('/api/crearAspirante')
  async create(@Body() aspirante: AspiranteDocument) {
    try {
      const newAspirante = await this.aspiranteService.createAspirante(aspirante);
      return { message: 'Aspirante creado con éxito', aspirante: newAspirante };
    } catch (error) {
      if (error.message === 'El CURP ya está registrado') {
        throw new HttpException({ message: 'Error creando el aspirante', details: 'El CURP ya está registrado' }, HttpStatus.CONFLICT);
      }
      if (error.message === 'El correo electrónico ya está registrado') {
        throw new HttpException({ message: 'Error creando el aspirante', details: 'El correo electrónico ya está registrado' }, HttpStatus.CONFLICT);
      }
      throw new HttpException({ message: 'Error interno del servidor', details: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/api/login')
  async login(@Body() credentials: { correo: string; curp: string }) {
    const { correo, curp } = credentials;
    try {
      const result = await this.aspiranteService.authenticate(correo, curp);
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        return { message: error.message };
      }
      return { message: 'Error interno del servidor', error: error.message };
    }
  }
  
  @Get('/api/obtenerAspirantes')
  async getAll() {
    try {
      const aspirantes = await this.aspiranteService.getAllAspirantes();
      return { aspirantes };
    } catch (error) {
      throw new HttpException({ message: 'Error obteniendo aspirantes', details: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/api/obtenerAspirante/:id')
  async getById(@Param('id') id: string) {
    try {
      const aspirante = await this.aspiranteService.getAspiranteById(id);
      return { aspirante };
    } catch (error) {
      throw new HttpException({ message: 'Error obteniendo aspirante', details: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/api/actualizarAspirante/:id')
  async update(@Param('id') id: string, @Body() aspiranteDto: Partial<AspiranteDocument>) {
    try {
      await this.aspiranteService.updateAspirante(id, aspiranteDto);
      return { message: 'Aspirante actualizado exitosamente' };
    } catch (error) {
      throw new HttpException({ message: 'Error actualizando aspirante', details: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/api/eliminarAspirante/:id')
  async delete(@Param('id') id: string) {
    try {
      await this.aspiranteService.deleteAspirante(id);
      return { message: 'Aspirante eliminado exitosamente' };
    } catch (error) {
      throw new HttpException({ message: 'Error eliminando aspirante', details: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
