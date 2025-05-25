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
import { CoursesService } from './courses.service';
import { CreateCourseDto, RegisterCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/types/global.constanst';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ResponseMessage('Create a new Course')
  create(@Body() createCourseDto: CreateCourseDto, @User() user: IUser) {
    return this.coursesService.create(createCourseDto, user);
  }

  @Get()
  @ResponseMessage('Fetch courses with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.coursesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch course by id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a Course')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @User() user: IUser,
  ) {
    return this.coursesService.update(id, updateCourseDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a Course')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.coursesService.remove(id, user);
  }

  @Post('register-course')
  @ResponseMessage('Register a Course')
  registerCourse(
    @Body() registerCourse: RegisterCourseDto,
    @User() user: IUser,
  ) {
    return this.coursesService.register(registerCourse, user);
  }

  @Post('registered-course')
  @ResponseMessage('Registered a Courses')
  registeredCourses(@User() user: IUser) {
    return this.coursesService.findRegisteredCourses(user);
  }

  @Patch(':id/assign-students')
  @ResponseMessage('Assign a Courses')
  assign(@Param('id') courseId: string) {
    return this.coursesService.assignStudentsAndTeacherToClasses(courseId);
  }
}
