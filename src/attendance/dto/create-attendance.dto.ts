import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class AttendInfo {
  @IsMongoId({ each: true, message: 'userId co moi phan tu la objectId' })
  @IsNotEmpty({ message: 'userId khong duoc de trong' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'status khong duoc de trong' })
  status: string;

  @IsOptional()
  reason?: string;
}

export class infoUserCheckedAbsent {
  @IsMongoId({ each: true, message: 'userId co moi phan tu la objectId' })
  @IsNotEmpty({ message: 'userId khong duoc de trong' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ each: true, message: 'classId co moi phan tu la objectId' })
  @IsNotEmpty({ message: 'classId khong duoc de trong' })
  classId: mongoose.Schema.Types.ObjectId[];
}

export class CreateAttendanceDto {
  @IsMongoId({ each: true, message: 'classId co moi phan tu la objectId' })
  @IsNotEmpty({ message: 'classId khong duoc de trong' })
  classId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'date khong duoc de trong' })
  date: Date;

  @IsNotEmpty({ message: 'studentAttendInfo khong duoc de trong' })
  @ValidateNested()
  @Type(() => AttendInfo)
  studentAttendInfo: AttendInfo[];
}
