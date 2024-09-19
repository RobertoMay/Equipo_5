import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ConvocatoriaService } from 'src/service/convocatoria.service';
import { Convocatoria } from 'src/module/modelsConvocatoria';

@Controller('api/convocatorias')
export class ConvocatoriaController {
  constructor(private readonly convocatoriaService: ConvocatoriaService) {}

  @Post()
  async createNewConvocatoria(@Body() newConvocatoria: Convocatoria) {
    const convocatoria =
      await this.convocatoriaService.createConvocatoria(newConvocatoria);
    return { message: 'Convocatoria creada con éxito', convocatoria };
  }

  @Get()
  async getAllConvocatorias() {
    const convocatorias = await this.convocatoriaService.getAllConvocatorias();
    return convocatorias;
  }

  @Get('/titulo')
  async getConvocatoriaByTitle(@Query('titulo') titulo: string) {
    const convocatoria =
      await this.convocatoriaService.getConvocatoriaByTitle(titulo);
    return convocatoria;
  }

  @Delete('/titulo')
  async deleteConvocatoriaByTitle(@Query('titulo') titulo: string) {
    await this.convocatoriaService.deleteConvocatoriaByTitle(titulo);
    return { message: 'Convocatoria(s) eliminada(s) con éxito' };
  }

  @Put('/titulo')
  async updateConvocatoriaByTitle(
    @Query('titulo') titulo: string,
    @Body() updatedConvocatoria: Partial<Convocatoria>,
  ) {
    await this.convocatoriaService.updateConvocatoriaByTitle(titulo, updatedConvocatoria);
    return { message: 'Convocatoria(s) actualizada(s) con éxito' };
  }
}
