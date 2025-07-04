import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from './schemas/voucher.schema';
import { TuitionModule } from 'src/tuition/tuition.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Voucher.name, schema: VoucherSchema }]),
    TuitionModule,
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [MongooseModule],
})
export class VoucherModule {}
