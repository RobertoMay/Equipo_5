import { Controller, Get, Put, Body, Param, BadRequestException, HttpException, HttpStatus, Post, NotFoundException, Delete } from '@nestjs/common';
import { AboutService } from '../service/about.service';
import { AboutDocument } from 'src/todos/document/about.document';

@Controller('api/about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  /**
   * Crea un nuevo documento en la colección About con misión, visión y nombre del director(a).
   * @param data - Datos de la misión, visión y director(a) a crear.
   * @returns Un mensaje de éxito y el documento creado.
   */
  @Post('/info')
  async createAboutInfo(
    @Body() data: AboutDocument
  ): Promise<{ message: string; document: AboutDocument }> {
    try {
      const newInfo = await this.aboutService.createAboutInfo(data);
      return newInfo; // Devuelve el mensaje y el documento completo
    } catch (error) {
      throw new HttpException(
        { message: 'Error al crear la información', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtiene todos los documentos almacenados en la colección About.
   * @returns Un array con todos los documentos en la colección About.
   */
  @Get('/all')
  async getAboutInfo() {
    try {
      const aboutInfo = await this.aboutService.getAboutInfo();
      return aboutInfo;
    } catch (error) {
      throw new HttpException(
        { message: 'Error al obtener la información', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtiene un documento específico de la colección About usando su ID.
   * @param id - ID del documento a obtener.
   * @returns El documento correspondiente al ID proporcionado.
   */
  @Get('/about/:id')
  async getAboutInfoById(@Param('id') id: string) {
    try {
      const aboutInfo = await this.aboutService.getAboutInfoById(id);
      return aboutInfo;
    } catch (error) {
      throw new HttpException(
        { message: 'Error al obtener la información', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Actualiza un documento específico en la colección About usando su ID.
   * Solo se actualizan los campos proporcionados que no están vacíos.
   * @param id - ID del documento a actualizar.
   * @param updateData - Objeto con los datos a actualizar (misión, visión y/o directorName).
   * @returns Un mensaje de éxito y el documento actualizado.
   */
  @Put('/updateInfo/:id')
  async updateAboutInfoById(
    @Param('id') id: string,
    @Body() updateData: { mission?: string; vision?: string; directorName?: string }
  ): Promise<{ message: string; document: AboutDocument }> {
    try {
      // Validar que no se envíen campos vacíos
      if (
        (updateData.mission && updateData.mission.trim() === '') ||
        (updateData.vision && updateData.vision.trim() === '') ||
        (updateData.directorName && updateData.directorName.trim() === '')
      ) {
        throw new BadRequestException('No se permiten campos vacíos');
      }

      const updatedInfo = await this.aboutService.updateAboutInfoById(id, updateData);
      return updatedInfo; // Devuelve el mensaje y el documento completo
    } catch (error) {
      throw new HttpException(
        { message: 'Error al actualizar la información', details: error.message },
        error instanceof BadRequestException
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Elimina un documento específico en la colección About usando su ID.
   * @param id - ID del documento a eliminar.
   * @returns Un mensaje de éxito si el documento fue eliminado correctamente.
   */
  @Delete('/delete/:id')
  async deleteAboutInfoById(@Param('id') id: string) {
    try {
      return await this.aboutService.deleteAboutInfoById(id);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al eliminar la información',
          details: error.message,
        },
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
