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
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/types/global.constanst';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @ResponseMessage('Create a new Class')
  create(@Body() createClassDto: CreateClassDto, @User() user: IUser) {
    return this.classService.create(createClassDto, user);
  }

  @Get()
  @ResponseMessage('Fetch class with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.classService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch class by id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a Class')
  update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @User() user: IUser,
  ) {
    return this.classService.update(id, updateClassDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a Course')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.classService.remove(id, user);
  }

  @Post('teacher-in-class')
  @ResponseMessage('Fetch Class of Teacher')
  handleFetchClassOfTeacher(@User() user: IUser) {
    return this.classService.fetchClassOfTeacher(user);
  }

  @Post('student-in-class')
  @ResponseMessage('Fetch Class of Student')
  handleFetchClassOfStudent(@Body('id') id: string) {
    return this.classService.fetchClassOfStudent(id);
  }
}
