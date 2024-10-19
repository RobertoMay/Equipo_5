// import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
// import { GenericService } from '../shared/generic.service';  // Ajusta la ruta según tu estructura

// @Controller('api/:collectionName')  // El nombre de la colección será un parámetro en la URL
// export class GenericController<T> {
//   private service: GenericService<T>;

//   constructor(service: GenericService<T>) {
//     this.service = service;
//   }

//   // Obtener todos los documentos de la colección
//   @Get('/')
//   async findAll(@Param('collectionName') collectionName: string): Promise<T[]> {
//     try {
//       this.service.collectionName = collectionName;  // Establecer el nombre de la colección dinámicamente
//       return await this.service.findAll();
//     } catch (error) {
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   // Obtener un documento por ID
//   @Get('/:id')
//   async findById(@Param('collectionName') collectionName: string, @Param('id') id: string): Promise<T> {
//     try {
//       this.service.collectionName = collectionName;  // Establecer el nombre de la colección dinámicamente
//       return await this.service.findById(id);
//     } catch (error) {
//       throw new HttpException(error.message, HttpStatus.NOT_FOUND);
//     }
//   }

//   // Crear un nuevo documento
//   @Post('/')
//   async create(@Param('collectionName') collectionName: string, @Body() data: T): Promise<T> {
//     try {
//       this.service.collectionName = collectionName;  // Establecer el nombre de la colección dinámicamente
//       return await this.service.create(data);
//     } catch (error) {
//       throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
//     }
//   }

//   // Actualizar un documento por ID
//   @Put('/:id')
//   async update(
//     @Param('collectionName') collectionName: string,
//     @Param('id') id: string,
//     @Body() data: Partial<T>,
//   ): Promise<void> {
//     try {
//       this.service.collectionName = collectionName;  // Establecer el nombre de la colección dinámicamente
//       return await this.service.update(id, data);
//     } catch (error) {
//       throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
//     }
//   }

//   // Eliminar un documento por ID
//   @Delete('/:id')
//   async delete(@Param('collectionName') collectionName: string, @Param('id') id: string): Promise<void> {
//     try {
//       this.service.collectionName = collectionName;  // Establecer el nombre de la colección dinámicamente
//       return await this.service.delete(id);
//     } catch (error) {
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }
