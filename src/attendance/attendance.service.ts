import { Injectable } from '@nestjs/common';
import {
  CreateAttendanceDto,
  infoUserCheckedAbsent,
} from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { IUser } from 'src/types/global.constanst';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
import aqp from 'api-query-params';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import mongoose from 'mongoose';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private AttendanceModel: SoftDeleteModel<AttendanceDocument>,

    @InjectModel(User.name)
    private UserModel: SoftDeleteModel<UserDocument>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto, user: IUser) {
    const newAttendance = await this.AttendanceModel.create({
      ...createAttendanceDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newAttendance._id,
      createdAt: newAttendance.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * +limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.AttendanceModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.AttendanceModel.find(filter)
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
    return await this.AttendanceModel.findById(id);
  }

  async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
    user: IUser,
  ) {
    return this.AttendanceModel.updateOne(
      { _id: id },
      {
        ...updateAttendanceDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.AttendanceModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.AttendanceModel.softDelete({ _id: id });
  }

  async absent(infoChecked: infoUserCheckedAbsent) {
    const { classId: classIds, userId } = infoChecked;

    const results: {
      classId: string;
      absentLength: number;
      detail: {
        attendanceId: string;
        date?: Date;
        note?: string;
      }[];
    }[] = [];

    for (const id of classIds) {
      const classObjectId = new mongoose.Types.ObjectId(id.toString());

      const attendances = await this.AttendanceModel.find({
        classId: classObjectId,
      });

      const detail: {
        attendanceId: string;
        date?: Date;
        reason?: string;
      }[] = [];

      for (const attendance of attendances) {
        const studentInfo = attendance.studentAttendInfo.find(
          (info) =>
            info.status === 'ABSENT' &&
            info.userId.toString() === userId.toString(),
        );

        if (studentInfo) {
          detail.push({
            attendanceId: attendance._id.toString(),
            date: attendance.date,
            reason: studentInfo.reason || '',
          });
        }
      }

      const absentCount = detail.length;

      // Cập nhật lại user.absent nếu cần
      await this.UserModel.updateOne(
        { _id: userId },
        { $pull: { absent: { classId: classObjectId } } },
      );

      if (absentCount > 0) {
        await this.UserModel.updateOne(
          { _id: userId },
          {
            $push: {
              absent: {
                classId: classObjectId,
                absentLength: absentCount,
              },
            },
          },
        );
      }

      results.push({
        classId: id.toString(),
        absentLength: absentCount,
        detail,
      });
    }

    return results;
  }

  async absentUpdateAll(info: { classId: string }) {
    const { classId } = info;

    if (!mongoose.isValidObjectId(classId)) {
      throw new Error('classId không hợp lệ');
    }

    const users = await this.UserModel.find();

    for (const user of users) {
      let infoChecked: any = {
        userId: user._id,
        classId,
      };
      await this.absent(infoChecked);
    }

    return 'Done';
  }

  async fetchAttendanceOfClass(idClass: string) {
    return await this.AttendanceModel.find({ classId: idClass });
  }
}
