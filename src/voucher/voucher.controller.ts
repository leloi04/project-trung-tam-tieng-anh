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
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/types/global.constanst';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  @ResponseMessage('Create a new Voucher')
  create(@Body() createVoucherDto: CreateVoucherDto, @User() user: IUser) {
    return this.voucherService.create(createVoucherDto, user);
  }

  @Get()
  @ResponseMessage('Fetch Voucher with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.voucherService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch Voucher by id')
  findOne(@Param('id') id: string) {
    return this.voucherService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a Voucher')
  update(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
    @User() user: IUser,
  ) {
    return this.voucherService.update(id, updateVoucherDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a Voucher')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.voucherService.remove(id, user);
  }
}
