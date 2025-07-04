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
import { ClassScheduleService } from './class-schedule.service';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/types/global.constanst';

@Controller('class-schedule')
export class ClassScheduleController {
  constructor(private readonly classScheduleService: ClassScheduleService) {}

  @Post()
  @ResponseMessage('Create a new Schedule Class')
  create(
    @Body() createClassScheduleDto: CreateClassScheduleDto,
    @User() user: IUser,
  ) {
    return this.classScheduleService.create(createClassScheduleDto, user);
  }

  @Get()
  @ResponseMessage('Fetch Schedule Class with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.classScheduleService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch Schedule Class by id')
  findOne(@Param('id') id: string) {
    return this.classScheduleService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a Schedule Class')
  update(
    @Param('id') id: string,
    @Body() updateClassScheduleDto: UpdateClassScheduleDto,
    @User() user: IUser,
  ) {
    return this.classScheduleService.update(id, updateClassScheduleDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a Schedule Class')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.classScheduleService.remove(id, user);
  }

  @Post('acount-lesson-month/:id')
  @ResponseMessage('Get total lesson of month')
  handleGetLessonOfMonth(@Param('id') id: string, @User() user: IUser) {
    return this.classScheduleService.getLessonOfMonth(id, user);
  }

  @Post('schedule-student')
  @ResponseMessage('Get schedule of student')
  handleGetScheduleOfStudent(
    @Query('idChildren') id: string,
    @User() user: IUser,
  ) {
    return this.classScheduleService.getScheduleOfStudent(user, id);
  }

  @Post('schedule-teacher')
  @ResponseMessage('Get schedule of teacher')
  handleGetScheduleOfTeacher(@User() user: IUser) {
    return this.classScheduleService.getScheduleOfTeacher(user);
  }
}
