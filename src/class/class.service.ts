import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Class, ClassDocument } from './schemas/class.schema';
import { IUser } from 'src/types/global.constanst';
import aqp from 'api-query-params';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name)
    private ClassModel: SoftDeleteModel<ClassDocument>,
  ) {}

  async create(createClassDto: CreateClassDto, user: IUser) {
    const newClass = await this.ClassModel.create({
      ...createClassDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newClass._id,
      createdAt: newClass.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * +limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.ClassModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.ClassModel.find(filter)
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
    return await this.ClassModel.findById(id)
      .populate({
        path: 'teachers',
        select: { name: 1 },
      })
      .populate({
        path: 'students',
        select: { name: 1 },
      })
      .populate({
        path: 'courseId',
        select: { name: 1 },
      })
      .populate({
        path: 'curriculumId',
        select: { name: 1 },
      });
  }

  async update(id: string, updateClassDto: UpdateClassDto, user: IUser) {
    return this.ClassModel.updateOne(
      { _id: id },
      {
        ...updateClassDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.ClassModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.ClassModel.softDelete({ _id: id });
  }
}
