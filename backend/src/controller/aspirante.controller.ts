import { Controller, Post, Put, Delete, Get, Param, Body, HttpException, HttpStatus, Response, Res, ConflictException, InternalServerErrorException} from '@nestjs/common';
import { AspiranteService } from '../service/aspirante.service';
import { Aspirante } from '../module/aspirante.model';
import { AspiranteDocument } from 'src/todos/document/aspirante.document';
import { Response as ExpressResponse } from 'express';
import * as jwt from 'jsonwebtoken';
@Controller('api/aspirante/')
export class AspiranteController {
  constructor(private readonly aspiranteService: AspiranteService) {}

  @Post('crearAspirante') //crea a los aspirantes pero de igual manera verifica que no haya curps o correos duplicados
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

  @Post('login') //compara los datos ya registrados para poder dar paso al inicio de sesión
  async login(@Body() credentials: { correo: string; curp: string }) {
    const { correo, curp } = credentials;
    try {
      const result = await this.aspiranteService.authenticate(correo, curp);

      // Generación del token
      const token = jwt.sign({ sub: result.nombresCompletos, esAdministrador: result.esAdministrador }, 'mi-llave-secreta', { expiresIn: '1h' });

      return {
        message: 'Inicio de sesión exitoso',
        token,
        nombresCompletos: result.nombresCompletos,
        esAdministrador: result.esAdministrador, // Devuelve si es administrador
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException({ message: error.message }, HttpStatus.CONFLICT);
      }
      throw new HttpException({ message: 'Error interno del servidor', details: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get('obtenerAspirantes')//obtiene todos los asopirantes registrados
  async getAll() {
    try {
      const aspirantes = await this.aspiranteService.getAllAspirantes();
      return { aspirantes };
    } catch (error) {
      throw new HttpException({ message: 'Error obteniendo aspirantes', details: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('obtenerAspirante/:id')//obtiene todos los aspirantes por id
  async getById(@Param('id') id: string) {
    try {
      const aspirante = await this.aspiranteService.getAspiranteById(id);
      return { aspirante };
    } catch (error) {
      throw new HttpException({ message: 'Error obteniendo aspirante', details: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('actualizarAspirante/:id')//actualiza los usuarios de acuerdo a su id
  async update(@Param('id') id: string, @Body() aspiranteDto: Partial<AspiranteDocument>) {
    try {
      await this.aspiranteService.updateAspirante(id, aspiranteDto);
      return { message: 'Aspirante actualizado exitosamente' };
    } catch (error) {
      throw new HttpException({ message: 'Error actualizando aspirante', details: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('eliminarAspirante/:id')//elimina a los usuarios de acuerdo a su id
  async delete(@Param('id') id: string) {
    try {
      await this.aspiranteService.deleteAspirante(id);
      return { message: 'Aspirante eliminado exitosamente' };
    } catch (error) {
      throw new HttpException({ message: 'Error eliminando aspirante', details: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
