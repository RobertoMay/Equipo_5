import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { GenericService } from './generic.service'; // Ajusta el path según tu estructura de carpetas

export function createGenericController<T>(collectionName: string, endpoint: string) {
  @Controller(endpoint)
  class GenericController {
    public readonly genericService: GenericService<T>;

    constructor() {
      this.genericService = new GenericService<T>(collectionName);
    }

    @Get('/')
    async findAll(): Promise<T[]> {
      try {
        return await this.genericService.findAll();
      } catch (error) {
        throw new HttpException(
          'Error retrieving data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Get('/:id')
    async findById(@Param('id') id: string): Promise<T> {
      try {
        const item = await this.genericService.findById(id);
        if (!item) {
          throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        }
        return item;
      } catch (error) {
        if (error.message === 'Documento no encontrado') {
          throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          'Error retrieving item',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Post('/')
    async create(@Body() data: T): Promise<T> {
      try {
        return await this.genericService.create(data);
      } catch (error) {
        throw new HttpException(
          'Error creating item',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() data: Partial<T>): Promise<void> {
      try {
        await this.genericService.update(id, data);
      } catch (error) {
        if (error.message.includes('No document to update')) {
          throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          'Error updating item',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Delete('/:id')
    async delete(@Param('id') id: string): Promise<void> {
      try {
        await this.genericService.delete(id);
      } catch (error) {
        if (error.message.includes('No document to delete')) {
          throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          'Error deleting item',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  return GenericController;
}
