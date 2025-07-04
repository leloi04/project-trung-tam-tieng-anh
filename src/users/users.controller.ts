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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPassword } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/types/global.constanst';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage('Create a new User')
  @Post()
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Fetch users with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch user by id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a User')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a User')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }

  @Post('student')
  @ResponseMessage('Get list User')
  getStudent() {
    return this.usersService.getStudent();
  }

  @Post('children')
  @ResponseMessage('Get list Children')
  getChildren(@Body('children') children: string[]) {
    return this.usersService.getChildren(children);
  }

  @Post('update-password')
  @ResponseMessage('Update password')
  handleUpdatePassword(
    @Body() updateUserPassword: UpdateUserPassword,
    @User() user: IUser,
  ) {
    return this.usersService.updatePassword(updateUserPassword, user);
  }
}
