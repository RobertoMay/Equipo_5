import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { ConvocatoriaService } from 'src/service/convocatoria.service';
import { Convocatoria } from 'src/module/modelsConvocatoria';

@Controller('api/calls')
export class ConvocatoriaController {
  constructor(private readonly convocatoriaService: ConvocatoriaService) {}

  @Post('create')
  async createNewConvocatoria(@Body() newConvocatoria: Convocatoria) {
    const convocatoria = await this.convocatoriaService.createConvocatoria(newConvocatoria);
    return { message: 'Convocatoria creada con éxito', convocatoria };
  }

  @Get('/getallcalls')
  async getAllConvocatorias() {
    const convocatorias = await this.convocatoriaService.getAllConvocatorias();
    return convocatorias;
  }

  @Get('/getcall/:title') // Cambiado a :title
  async getConvocatoriaByTitle(@Param('title') title: string) {
    const convocatoria = await this.convocatoriaService.getConvocatoriaByTitle(title);
    if (!convocatoria) {
      throw new NotFoundException(`Announcement with title "${title}" not found.`);
    }
    return convocatoria;
  }

  @Delete('/deletecall/:title') // Cambiado a :title
  async deleteConvocatoriaByTitle(@Param('title') title: string) {
    await this.convocatoriaService.deleteConvocatoriaByTitle(title);
    return { message: 'Convocatoria(s) eliminada(s) con éxito' };
  }

  @Put('/updatecalls/:title')
  async updateConvocatoriaByTitle(
    @Param('title') title: string,
    @Body() updatedConvocatoria: Partial<Convocatoria>
  ) {
    // Llama al servicio para actualizar la convocatoria
    await this.convocatoriaService.updateConvocatoriaByTitle(title, updatedConvocatoria);
    
    // Suponiendo que la actualización fue exitosa
    return { message: 'Announcement updated successfully' };
  }
  
}
