import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { IUser } from 'src/types/global.constanst';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher, VoucherDocument } from './schemas/voucher.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { Tuition, TuitionDocument } from 'src/tuition/schemas/tuition.schema';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name)
    private VoucherModel: SoftDeleteModel<VoucherDocument>,

    @InjectModel(Tuition.name)
    private TuitionModel: SoftDeleteModel<TuitionDocument>,
  ) {}

  async create(createVoucherDto: CreateVoucherDto, user: IUser) {
    const { validFrom, validUntil, maxUsage, isActive, appliedToCourse, code } =
      createVoucherDto;
    const isValid = code.slice(0, 3).includes('LVL');
    if (isValid) {
      const start = new Date(validFrom);
      const end = new Date(validUntil);

      const newVoucher = await this.VoucherModel.create({
        ...createVoucherDto,
        validFrom: start.toString(),
        validUntil: end.toString(),
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });

      return {
        _id: newVoucher._id,
        createdAt: newVoucher.createdAt,
      };
    }
    throw new BadRequestException('Mã code phải bắt đầu bằng LVL');
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * +limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.VoucherModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.VoucherModel.find(filter)
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
    return await this.VoucherModel.findById(id);
  }

  async update(id: string, updateVoucherDto: UpdateVoucherDto, user: IUser) {
    return this.VoucherModel.updateOne(
      { _id: id },
      {
        ...updateVoucherDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.VoucherModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.VoucherModel.softDelete({ _id: id });
  }
}
