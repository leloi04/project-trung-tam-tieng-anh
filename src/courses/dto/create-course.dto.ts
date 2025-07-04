import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'name khong duoc de trong' })
  name: string;

  @IsNotEmpty({ message: 'ageGroup khong duoc de trong' })
  ageGroup: string;

  @IsNotEmpty({ message: 'description khong duoc de trong' })
  description: string;

  @IsNotEmpty({ message: 'totalSessions khong duoc de trong' })
  totalSessions: number;

  @IsNotEmpty({ message: 'maxStudent khong duoc de trong' })
  maxStudent: number;

  @IsNotEmpty({ message: 'teacher khong duoc de trong' })
  teacher: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'startDate khong duoc de trong' })
  startDate: Date;

  @IsNotEmpty({ message: 'endDate khong duoc de trong' })
  endDate: Date;

  @IsNotEmpty({ message: 'pricePerSession khong duoc de trong' })
  pricePerSession: number;

  @IsNotEmpty({ message: 'thumbnail khong duoc de trong' })
  thumbnail: string;

  @IsNotEmpty({ message: 'openMode khong duoc de trong' })
  openMode: string;

  @IsOptional()
  isOpen?: boolean;

  @IsNotEmpty({ message: 'detail khong duoc de trong' })
  detail: {
    information: string;
    program: string;
  };
}

export class RegisterCourseDto {
  @IsMongoId({ message: 'courseId phai la objectId' })
  @IsNotEmpty({ message: 'idCourse khong duoc de trong' })
  courseId: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  status?: string;

  @IsOptional()
  @IsMongoId({ message: 'assignedClassId phai la objectId' })
  assignedClassId?: mongoose.Schema.Types.ObjectId;
}

export class DistributeClass {
  @IsNotEmpty({ message: 'classId khong duoc de trong' })
  classId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'options gom courseId hoac studentsId khong duoc de trong',
  })
  options: {
    courseId?: mongoose.Schema.Types.ObjectId;
    studentIds?: string[];
  };
}
