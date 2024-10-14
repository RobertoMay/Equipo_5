import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HojasInscripcionService } from '../service/hojasinscripcion.service';
import { Response } from 'express';

@Controller('api/hojas-inscripcion')
export class HojasInscripcionController {
  constructor(
    private readonly hojasInscripcionService: HojasInscripcionService,
  ) {}

  @Post('/:aspirantId')
  async create(@Param('aspirantId') aspirantId: string, @Body() data: any) {
    try {
      // Llama a tu método de generación y carga del PDF
      await this.hojasInscripcionService.generateAndUploadPdf(aspirantId, data);
      return { message: 'PDF generado y subido correctamente' };
    } catch (error) {
      return { message: error.message };
    }
  }
}
