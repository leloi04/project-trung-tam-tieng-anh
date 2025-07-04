import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTuitionDto {
  @IsMongoId({ message: 'studentId co moi phan tu la objectId' })
  @IsNotEmpty({ message: 'studentId khong duoc de trong' })
  studentId: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'courseId co moi phan tu la objectId' })
  @IsNotEmpty({ message: 'courseId khong duoc de trong' })
  courseId: mongoose.Schema.Types.ObjectId;

  // @IsNotEmpty({ message: 'month khong duoc de trong' })
  // month: number;

  // @IsNotEmpty({ message: 'year khong duoc de trong' })
  // year: number;

  @IsNotEmpty({ message: 'amountPaid khong duoc de trong' })
  amountPaid: number;

  @IsNotEmpty({ message: 'calculatedTuition khong duoc de trong' })
  calculatedTuition: number;
}
