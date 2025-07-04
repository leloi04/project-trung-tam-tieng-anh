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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/types/global.constanst';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ResponseMessage('Create a new Payment')
  create(@Body() createPaymentDto: CreatePaymentDto, @User() user: IUser) {
    return this.paymentService.create(createPaymentDto, user);
  }

  @Get()
  @ResponseMessage('Fetch Payment with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.paymentService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch payment by id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a payment')
  update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @User() user: IUser,
  ) {
    return this.paymentService.update(id, updatePaymentDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a payment')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.paymentService.remove(id, user);
  }
}
