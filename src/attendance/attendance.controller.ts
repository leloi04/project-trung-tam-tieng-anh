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
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  infoUserCheckedAbsent,
} from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/types/global.constanst';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ResponseMessage('Create a new Attendance')
  create(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @User() user: IUser,
  ) {
    return this.attendanceService.create(createAttendanceDto, user);
  }

  @Get()
  @ResponseMessage('Fetch Attendance with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.attendanceService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch Attendance by id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a Attendance')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @User() user: IUser,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a Attendance')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.attendanceService.remove(id, user);
  }

  @Post('absent')
  @ResponseMessage('Acount of Absent')
  absentClass(@Body() infoChecked: infoUserCheckedAbsent) {
    return this.attendanceService.absent(infoChecked);
  }

  @Post('absent-all')
  @ResponseMessage('Update Absent of all user ')
  absentAll(@Body() info: any) {
    return this.attendanceService.absentUpdateAll(info);
  }
}
