import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateClassScheduleDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'classId khong duoc de trong' })
  classId: mongoose.Schema.Types.ObjectId;

  @IsArray()
  @IsNotEmpty({ message: 'daysOfWeek khong duoc de trong' })
  daysOfWeek: number[]; // [1, 3] cho Thứ 2 và Thứ 4

  @IsNotEmpty({ message: 'startTime khong duoc de trong' })
  startTime: string;

  @IsOptional()
  date?: string;

  @IsNotEmpty({ message: 'endTime khong duoc de trong' })
  endTime: string;

  @IsDateString()
  @IsNotEmpty({ message: 'fromDate khong duoc de trong' })
  fromDate: string;

  @IsDateString()
  @IsNotEmpty({ message: 'toDate khong duoc de trong' })
  toDate: string;

  @IsNotEmpty({ message: 'studyMethod khong duoc de trong' })
  studyMethod: string;

  @IsOptional()
  note?: string;

  @IsOptional()
  isCanceled?: boolean;
}
