import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto, RegisterCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './schemas/course.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/types/global.constanst';
import aqp from 'api-query-params';
import { Types } from 'mongoose';
import { Class, ClassDocument } from 'src/class/schemas/class.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private CourseModel: SoftDeleteModel<CourseDocument>,

    @InjectModel(Class.name)
    private ClassModel: SoftDeleteModel<ClassDocument>,
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

  async assignStudentsAndTeacherToClasses(courseId: string) {
    // 1. Lấy Course
    const course = await this.CourseModel.findById(courseId);
    if (!course) throw new BadRequestException('Course not found');

    // 2. Lấy danh sách học sinh đăng ký (chưa gán lớp)
    const unassignedStudents = course.registeredBy
      .filter((r) => r.status === 'PENDING')
      .map((r) => ({
        userId: r.userId, // fallback nếu thiếu userId
        raw: r, // lưu lại toàn bộ object để cập nhật sau
      }));

    // 3. Lấy danh sách Class có courseId = course._id
    const classes = await this.ClassModel.find({ courseId });

    // 4. Phân chia học sinh vào lớp
    let startIndex = 0;
    const assignments: { userId: string; assignedClassId: Types.ObjectId }[] =
      [];

    for (const cls of classes) {
      const availableSlots = cls.totalStudent;
      const studentsChunk = unassignedStudents.slice(
        startIndex,
        startIndex + availableSlots,
      );
      const studentIds = studentsChunk.map((s) => s.userId);

      // Cập nhật class.students
      await this.ClassModel.updateOne(
        { _id: cls._id },
        {
          $addToSet: {
            students: { $each: studentIds },
            teachers: course.teacher,
          },
        },
      );

      // Ghi nhớ để cập nhật lại course.registeredBy
      for (const stu of studentsChunk) {
        assignments.push({
          userId: stu.userId.toString(),
          assignedClassId: cls._id,
        });
      }

      startIndex += studentsChunk.length;
    }

    // 5. Cập nhật lại course.registeredBy: status + assignedClassId
    course.registeredBy = course.registeredBy.map((entry) => {
      const assigned = assignments.find(
        (a) =>
          entry.userId?.toString() === a.userId ||
          entry.createdBy?._id?.toString() === a.userId,
      );

      if (assigned) {
        return {
          ...entry,
          status: 'ASSIGNED',
          assignedClassId: assigned.assignedClassId,
        };
      }

      return entry;
    });

    await course.save();

    return {
      message: 'Phân lớp và gán giáo viên thành công',
      totalAssigned: assignments.length,
    };
  }
}
