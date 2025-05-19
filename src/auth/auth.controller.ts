import {
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/types/global.constanst';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @ResponseMessage('Dang nhap thanh cong!')
  handleLogin(@Req() req, @Res({ passthrough: true }) response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @Post('register')
  @ResponseMessage('Dang ki thanh cong!')
  handleRegister(@Body() RegisterUserDto: RegisterUserDto) {
    return this.authService.register(RegisterUserDto);
  }

  @ResponseMessage('Get user information')
  @Get('account')
  async getAccount(@Request() req, @User() user: IUser) {
    // const temp = (await this.rolesService.findOne(user.role._id)) as any;
    // user.permissions = temp?.permissions;
    return req.user;
  }

  @Post('logout')
  @ResponseMessage('Dang xuat thanh cong!')
  handleLogout(@User() user: IUser, @Res({ passthrough: true }) response) {
    return this.authService.logout(user, response);
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('refresh')
  handleRefreshToken(@Req() request, @Res({ passthrough: true }) response) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }
}
