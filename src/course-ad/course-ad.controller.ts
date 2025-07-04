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
import { CourseAdService } from './course-ad.service';
import { CreateCourseAdDto } from './dto/create-course-ad.dto';
import { UpdateCourseAdDto } from './dto/update-course-ad.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/types/global.constanst';

@Controller('course-ad')
export class CourseAdController {
  constructor(private readonly courseAdService: CourseAdService) {}

  @Post()
  @ResponseMessage('Create a new courseAd')
  create(@Body() createCourseAdDto: CreateCourseAdDto, @User() user: IUser) {
    return this.courseAdService.create(createCourseAdDto, user);
  }

  @Get()
  @ResponseMessage('Fetch courseAd with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.courseAdService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch courseAd by id')
  findOne(@Param('id') id: string) {
    return this.courseAdService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a courseAd')
  update(
    @Param('id') id: string,
    @Body() updateCourseAdDto: UpdateCourseAdDto,
    @User() user: IUser,
  ) {
    return this.courseAdService.update(id, updateCourseAdDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a courseAd')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.courseAdService.remove(id, user);
  }
}
