import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServiceService } from 'src/service/service.service';

@Controller('controller')
export class ControllerController {
    constructor(private readonly serviceService:ServiceService){}

    @Post('/api/createData')
    async createData(@Body() data : any ): Promise <void>{
        await this.serviceService.createData(data);
    }


    @Get('/api/getData')
    async getData(): Promise <any>{
        return this.serviceService.getData();
    }
}
