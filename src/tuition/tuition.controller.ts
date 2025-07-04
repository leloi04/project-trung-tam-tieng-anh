import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TuitionService } from './tuition.service';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { UpdateTuitionDto } from './dto/update-tuition.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/types/global.constanst';

@Controller('tuition')
export class TuitionController {
  constructor(private readonly tuitionService: TuitionService) {}

  @Post()
  create(@Body() createTuitionDto: CreateTuitionDto) {
    return this.tuitionService.create(createTuitionDto);
  }

  @Get()
  findAll() {
    return this.tuitionService.findAll();
  }

  @Post('cost')
  getTuition(@User() user: IUser) {
    return this.tuitionService.getTuitionOfStudent(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tuitionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTuitionDto: UpdateTuitionDto) {
    return this.tuitionService.update(+id, updateTuitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tuitionService.remove(+id);
  }
}
