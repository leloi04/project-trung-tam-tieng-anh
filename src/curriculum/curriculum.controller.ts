import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/types/global.constanst';

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  @ResponseMessage('Create a new Curriculum')
  create(
    @Body() createCurriculumDto: CreateCurriculumDto,
    @User() user: IUser,
  ) {
    return this.curriculumService.create(createCurriculumDto, user);
  }

  @Get()
  @ResponseMessage('Fetch Curriculum with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.curriculumService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch Curriculum by id')
  findOne(@Param('id') id: string) {
    return this.curriculumService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a Curriculum')
  update(
    @Param('id') id: string,
    @Body() updateCurriculumDto: UpdateCurriculumDto,
    @User() user: IUser,
  ) {
    return this.curriculumService.update(id, updateCurriculumDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a Curriculum')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.curriculumService.remove(id, user);
  }
}
