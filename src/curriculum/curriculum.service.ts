import { Injectable } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { IUser } from 'src/types/global.constanst';
import { InjectModel } from '@nestjs/mongoose';
import { Curriculum, CurriculumDocument } from './schemas/curriculum.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectModel(Curriculum.name)
    private CurriculumModel: SoftDeleteModel<CurriculumDocument>,
  ) {}

  async create(createCurriculumDto: CreateCurriculumDto, user: IUser) {
    const newCurriculum = await this.CurriculumModel.create({
      ...createCurriculumDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newCurriculum._id,
      createdAt: newCurriculum.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * +limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.CurriculumModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.CurriculumModel.find(filter)
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
    return await this.CurriculumModel.findById(id);
  }

  async update(
    id: string,
    updateCurriculumDto: UpdateCurriculumDto,
    user: IUser,
  ) {
    return this.CurriculumModel.updateOne(
      { _id: id },
      {
        ...updateCurriculumDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.CurriculumModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.CurriculumModel.softDelete({ _id: id });
  }
}
