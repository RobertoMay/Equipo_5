import { Module } from '@nestjs/common';
import { BecarioService } from '../service/becario.service';
import { BecarioController } from '../controller/becario.controller';

@Module({
  controllers: [BecarioController],
  providers: [BecarioService],
})
export class BecarioModule {}
