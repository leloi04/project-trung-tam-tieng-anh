import { Injectable } from '@nestjs/common';
import { CreateCourseAdDto } from './dto/create-course-ad.dto';
import { UpdateCourseAdDto } from './dto/update-course-ad.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CourseAd, CourseAdDocument } from './schemas/course-ad.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/types/global.constanst';
import aqp from 'api-query-params';

@Injectable()
export class CourseAdService {
  constructor(
    @InjectModel(CourseAd.name)
    private courseAdModel: SoftDeleteModel<CourseAdDocument>,
  ) {}

  async create(createCourseAdDto: CreateCourseAdDto, user: IUser) {
    const newCourseAd = await this.courseAdModel.create({
      ...createCourseAdDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newCourseAd._id,
      createdAt: newCourseAd.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * +limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.courseAdModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.courseAdModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .populate(population)
      .exec();

    const now = new Date();
    let isActive: boolean;
    result.forEach((item) => {
      if (item.startDate <= now && item.endDate >= now) {
        isActive = true;
      } else {
        isActive = false;
      }
      item.isActive = isActive;
      item.save();
    });

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
    return await this.courseAdModel.findById(id);
  }

  async update(id: string, updateCourseAdDto: UpdateCourseAdDto, user: IUser) {
    return this.courseAdModel.updateOne(
      { _id: id },
      {
        ...updateCourseAdDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.courseAdModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.courseAdModel.softDelete({ _id: id });
  }
}
