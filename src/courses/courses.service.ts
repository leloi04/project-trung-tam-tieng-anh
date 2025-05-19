import { Injectable } from '@nestjs/common';
import { CreateCourseDto, RegisterCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './schemas/course.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/types/global.constanst';
import aqp from 'api-query-params';
import { Types } from 'mongoose';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private CourseModel: SoftDeleteModel<CourseDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto, user: IUser) {
    const newCourse = await this.CourseModel.create({
      ...createCourseDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newCourse._id,
      createdAt: newCourse.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * +limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.CourseModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.CourseModel.find(filter)
      .select('-password')
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
    return await this.CourseModel.findById(id).populate({
      path: 'registeredBy.userId',
      select: { name: 1 },
    });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, user: IUser) {
    return this.CourseModel.updateOne(
      { _id: id },
      {
        ...updateCourseDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.CourseModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.CourseModel.softDelete({ _id: id });
  }

  async register(registerCourse: RegisterCourseDto, user: IUser) {
    const { status = 'PENDING', courseId, assignedClassId } = registerCourse;
    return await this.CourseModel.updateOne(
      {
        _id: courseId,
      },
      {
        $push: {
          registeredBy: {
            userId: user._id,
            status,
            createdBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      },
    );
  }

  async findRegisteredCourses(user: IUser) {
    return await this.CourseModel.find({
      registeredBy: {
        $elemMatch: { userId: user._id },
      },
    }).select(['name', '_id']);
  }
}
