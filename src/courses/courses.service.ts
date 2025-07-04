import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCourseDto,
  DistributeClass,
  RegisterCourseDto,
} from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './schemas/course.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/types/global.constanst';
import aqp from 'api-query-params';
import mongoose, { Types } from 'mongoose';
import { Class, ClassDocument } from 'src/class/schemas/class.schema';
import { Tuition, TuitionDocument } from 'src/tuition/schemas/tuition.schema';
import { CreateTuitionDto } from 'src/tuition/dto/create-tuition.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private CourseModel: SoftDeleteModel<CourseDocument>,

    @InjectModel(Class.name)
    private ClassModel: SoftDeleteModel<ClassDocument>,

    @InjectModel(Tuition.name)
    private TuitionModel: SoftDeleteModel<TuitionDocument>,

    @InjectModel(User.name)
    private UserModal: SoftDeleteModel<UserDocument>,
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
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .populate(population)
      .exec();

    const now = new Date();
    let isActive: boolean;
    result.forEach((item) => {
      if (item.openMode == 'AUTO') {
        if (item.startDate <= now && item.endDate >= now) {
          isActive = true;
        } else {
          isActive = false;
        }
        item.isOpen = isActive;
        item.save();
      }
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
    return await this.CourseModel.findById(id)
      .populate({
        path: 'registeredBy.userId',
        select: { name: 1 },
      })
      .populate({
        path: 'teacher',
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
    const course = await this.CourseModel.findById(courseId);
    const totalSessions = course?.totalSessions as number;
    const pricePerSession = course?.pricePerSession as number;
    let amountPaid = 0;
    let calculatedTuition = this.calculateTuition(
      totalSessions,
      pricePerSession,
    );

    await this.TuitionModel.create({
      studentId: new mongoose.Types.ObjectId(user._id),
      courseId: courseId,
      amountPaid,
      calculatedTuition,
      remaining: calculatedTuition,
      isFullyPaid: false,
    });

    await this.CourseModel.updateOne(
      {
        _id: courseId,
      },
      {
        $pull: {
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

    await this.UserModal.updateOne(
      {
        _id: user._id,
      },
      {
        role: new mongoose.Types.ObjectId('68287380954ffe41c849b2b9'),
      },
    );

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

  async assignStudentsToClass(distributeClass: DistributeClass) {
    const { classId, options } = distributeClass;
    const cls = await this.ClassModel.findOne({ _id: classId });
    if (!cls) throw new BadRequestException('Class not found');

    let studentIdsToAssign: string[] = [];

    if (options.courseId) {
      const course = await this.CourseModel.findById(options.courseId);
      if (!course) throw new BadRequestException('Course not found');

      const unassignedStudents = course.registeredBy
        .filter((r) => r.status === 'PENDING')
        .map((r) => r.userId?.toString())
        .filter(Boolean);

      const availableSlots = cls.totalStudent - (cls.students?.length || 0);
      studentIdsToAssign = unassignedStudents.slice(0, availableSlots);

      await this.ClassModel.updateOne(
        { _id: classId },
        {
          $addToSet: {
            students: { $each: studentIdsToAssign },
            teachers: course.teacher,
          },
        },
      );

      course.registeredBy = course.registeredBy.map((entry) => {
        if (
          entry.userId &&
          studentIdsToAssign.includes(entry.userId.toString())
        ) {
          return {
            ...entry,
            status: 'ASSIGNED',
            assignedClassId: cls._id,
          };
        }
        return entry;
      });

      await course.save();

      return {
        message: 'Đã gán học sinh từ course vào lớp',
        assigned: studentIdsToAssign.length,
      };
    }

    if (options.studentIds?.length) {
      studentIdsToAssign = options.studentIds;

      await this.ClassModel.updateOne(
        { _id: classId },
        {
          $addToSet: {
            students: { $each: studentIdsToAssign },
          },
        },
      );

      return {
        message: 'Đã gán từng học sinh vào lớp',
        assigned: studentIdsToAssign.length,
      };
    }

    throw new BadRequestException('Vui lòng truyền courseId hoặc studentIds');
  }

  calculateTuition(
    totalSessions: number,
    pricePerSession: number,
    amountDiscount: number = 0,
  ) {
    const total = totalSessions * pricePerSession;
    let discounted = 0;

    if (amountDiscount > 0) {
      if (amountDiscount <= 100) {
        discounted = total - total * (amountDiscount / 100);
      }

      discounted = total - amountDiscount;
    } else {
      discounted = total;
    }

    return discounted;
  }
}
