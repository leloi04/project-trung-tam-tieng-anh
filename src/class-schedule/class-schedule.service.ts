import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  ClassSchedule,
  ClassScheduleDocument,
} from './schemas/class-schedule.schema';
import { IUser } from 'src/types/global.constanst';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import aqp from 'api-query-params';
import { Class, ClassDocument } from 'src/class/schemas/class.schema';

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectModel(ClassSchedule.name)
    private ClassScheduleModel: SoftDeleteModel<ClassScheduleDocument>,

    @InjectModel(Class.name)
    private ClassModel: SoftDeleteModel<ClassDocument>,
  ) {}

  toFullDate(dateStr: any, timeStr: string): Date {
    const [hour, minute] = timeStr.split(':').map(Number);
    const date = new Date(dateStr);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  async create(createClassScheduleDto: CreateClassScheduleDto, user: IUser) {
    const {
      classId,
      fromDate,
      toDate,
      daysOfWeek,
      startTime,
      endTime,
      studyMethod,
      note,
    } = createClassScheduleDto;

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const sessions: any[] = [];
    const classObjectId = new mongoose.Types.ObjectId(classId.toString());

    const fetchSessions = await this.ClassScheduleModel.find();

    const selectDate = fetchSessions.map((session: any) => {
      return session.date;
    });

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay(); // 0 = CN, 1 = T2, ..., 6 = T7

      if (daysOfWeek.includes(dayOfWeek)) {
        const checkedDate = this.toFullDate(d, startTime).toString();

        if (selectDate.includes(checkedDate)) {
          throw new BadRequestException(`bi trung lich ngay ${checkedDate}`);
        }

        sessions.push({
          classId: classObjectId,
          date: this.toFullDate(d, startTime),
          startTime,
          endTime,
          studyMethod,
          note,
          createdBy: {
            _id: user._id,
            email: user.email,
          },
        });
      }
    }

    return await this.ClassScheduleModel.insertMany(sessions);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    if (filter.classId) {
      try {
        filter.classId = new mongoose.Types.ObjectId(filter.classId);
      } catch (err) {
        throw new BadRequestException('classId không hợp lệ');
      }
    }
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * +limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.ClassScheduleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.ClassScheduleModel.find(filter)
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
    return await this.ClassScheduleModel.findById(id).populate({
      path: 'classId',
      select: { name: 1 },
    });
  }

  async update(
    id: string,
    updateClassScheduleDto: UpdateClassScheduleDto,
    user: IUser,
  ) {
    const { classId, date, endTime, startTime, studyMethod, note, isCanceled } =
      updateClassScheduleDto;
    return await this.ClassScheduleModel.updateOne(
      { _id: id },
      {
        classId: new mongoose.Types.ObjectId(classId as any),
        date: this.toFullDate(date, startTime!),
        endTime,
        startTime,
        studyMethod,
        note,
        isCanceled,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.ClassScheduleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.ClassScheduleModel.softDelete({ _id: id });
  }

  async getLessonOfMonth(id: string, user: IUser) {
    const classes = await this.ClassModel.find({
      students: user._id,
      courseId: id,
    });
    if (classes.length == 0) {
      return '';
    }

    const classIds = classes.map((cls) => cls._id);

    const schedules = await this.ClassScheduleModel.find({
      classId: { $in: classIds },
    }).populate({
      path: 'classId',
      select: { name: 1, description: 1 },
    });

    const monthlyLessonCounts: { [key: number]: number } = {};

    schedules.forEach((schedule) => {
      const month = new Date(schedule.date).getMonth() + 1;
      monthlyLessonCounts[month] = (monthlyLessonCounts[month] || 0) + 1;
    });

    const result = Object.keys(monthlyLessonCounts).map((month) => ({
      month: parseInt(month, 10),
      count: monthlyLessonCounts[parseInt(month, 10)],
    }));

    return result;
  }

  async getScheduleOfStudent(user: IUser, id: string) {
    const res = await this.ClassModel.find();
    let cls: any = [];
    if (id) {
      cls = res.filter((item) => item.students.includes(id as any));
    } else {
      cls = res.filter((item) => item.students.includes(user._id as any));
    }

    const clsIds = cls.map((item) => ({
      idClass: item._id,
      nameClass: item.name,
    }));
    const scheduleList = await Promise.all(
      clsIds.map(async (item) => {
        const lessons = await this.ClassScheduleModel.find({
          classId: new mongoose.Types.ObjectId(item.idClass),
        }).populate({
          path: 'classId',
          select: { name: 1, courseId: 1 },
          populate: {
            path: 'courseId',
            select: { name: 1 },
          },
        });

        return lessons;
      }),
    );

    let lessons: any = [];

    scheduleList.forEach((data) => {
      data.map((item) => {
        lessons.push({
          month: new Date(item.date).getMonth() + 1,
          schedule: item,
        });
      });
    });

    return lessons;
  }

  async getScheduleOfTeacher(user: IUser) {
    const res = await this.ClassModel.find();
    const cls = res.filter((item) => item.teachers.includes(user._id as any));

    const clsIds = cls.map((item) => ({
      idClass: item._id,
      nameClass: item.name,
    }));
    const scheduleList = await Promise.all(
      clsIds.map(async (item) => {
        const lessons = await this.ClassScheduleModel.find({
          classId: new mongoose.Types.ObjectId(item.idClass),
        }).populate({
          path: 'classId',
          select: { name: 1, courseId: 1 },
          populate: {
            path: 'courseId',
            select: { name: 1 },
          },
        });

        return lessons;
      }),
    );

    let lessons: any = [];

    scheduleList.forEach((data) => {
      data.map((item) => {
        lessons.push({
          month: new Date(item.date).getMonth() + 1,
          schedule: item,
        });
      });
    });

    return lessons;
  }
}
