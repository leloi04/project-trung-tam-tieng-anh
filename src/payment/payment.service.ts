import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Tuition, TuitionDocument } from 'src/tuition/schemas/tuition.schema';
import { IUser } from 'src/types/global.constanst';
import { Voucher, VoucherDocument } from 'src/voucher/schemas/voucher.schema';
import aqp from 'api-query-params';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: SoftDeleteModel<PaymentDocument>,

    @InjectModel(Tuition.name)
    private tuitionModel: SoftDeleteModel<TuitionDocument>,

    @InjectModel(Voucher.name)
    private voucherModel: SoftDeleteModel<VoucherDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: IUser) {
    const { tuitionId, amount, note, voucherId } = createPaymentDto;

    const tuition = await this.tuitionModel.findById(tuitionId);
    if (!tuition) {
      throw new NotFoundException('Không tìm thấy học phí');
    }

    let discountAmount = 0;
    if (voucherId) {
      const voucher = await this.voucherModel.findById(voucherId);
      if (!voucher) {
        throw new BadRequestException('Voucher không hợp lệ hoặc đã sử dụng');
      }

      if (voucher.type === 'PERCENT') {
        discountAmount = (tuition.remaining * voucher.value) / 100;
      } else {
        discountAmount = voucher.value;
      }

      if (voucher.usageCount < voucher.maxUsage) {
        voucher.usageCount += 1;
        voucher.save();
      }
    }

    const finalPaid = amount;
    tuition.amountPaid += finalPaid;
    tuition.remaining = tuition.remaining - finalPaid - discountAmount;
    tuition.isFullyPaid = tuition.remaining <= 0;
    await tuition.save();

    const payment = await this.paymentModel.create({
      tuitionId,
      userId: user._id,
      amount: finalPaid,
      note,
      voucherId: voucherId || undefined,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: payment._id,
      createdAt: payment.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * +limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.paymentModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.paymentModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    return await this.paymentModel.findById(id);
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto, user: IUser) {
    return this.paymentModel.updateOne(
      { _id: id },
      {
        ...updatePaymentDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.paymentModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.paymentModel.softDelete({ _id: id });
  }
}
