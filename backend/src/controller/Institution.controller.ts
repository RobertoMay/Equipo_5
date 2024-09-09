//institution.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { InstitutionService } from 'src/service/institution.service';
import { Institution } from 'src/module/modelsInstitution';

@Controller()
export class InstitutionController {
  constructor(private readonly institutionsService: InstitutionService) {}

  @Post('/api/createInstitution')
  async createNewInstitution(@Body() newInstitution: Institution) {
    const institution = await this.institutionsService.createInstitution(newInstitution);
    return { message: 'Institución creada con éxito' };
  }


  @Get('/api/institutions')
  async getAllInstitutions() {
    const institution = await this.institutionsService.getAllInstitutions();
    return institution;
  }
  
  @Get('/api/institution/:id')
  async getInstitutionById(@Param('id') institutionId: string) {
    const institution = await this.institutionsService.getInstitutionById(institutionId);
    return institution;
  }

  @Delete('/api/deleteInstitution/:id')
  async deleteInstitutionById(@Param('id') institutionId: string) {
    await this.institutionsService.deleteInstitutionById(institutionId);
    return { message: 'Institución eliminada con éxito' };
  }

  @Put('/api/updateInstitution/:id')
  async updateInstitution(@Param('id') institutionId: string, @Body() updatedInstitution: Institution) {
    const updatedInstitutionName = await this.institutionsService.updateInstitutionName(institutionId, updatedInstitution);
    return { message: 'Institución actualizada con éxito'};
  }
}