import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateClassDto {
  @IsNotEmpty({ message: 'name khong duoc de trong' })
  name: string;

  @IsNotEmpty({ message: 'code khong duoc de trong' })
  code: string;

  @IsNotEmpty({ message: 'year khong duoc de trong' })
  year: number;

  @IsBoolean({ message: 'isOpen khong dung dinh dang' })
  @IsNotEmpty({ message: 'isOpen khong duoc de trong' })
  isOpen: boolean;

  @IsNotEmpty({ message: 'description khong duoc de trong' })
  description: string;

  @IsMongoId({ each: true, message: 'teachers co moi phan tu la objectId' })
  @IsNotEmpty({ message: 'teachers khong duoc de trong' })
  teachers: mongoose.Schema.Types.ObjectId[];

  @IsMongoId({ each: true, message: 'students co moi phan tu la objectId' })
  @IsNotEmpty({ message: 'students khong duoc de trong' })
  students: mongoose.Schema.Types.ObjectId[];

  @IsNotEmpty({ message: 'studyMethod khong duoc de trong' })
  studyMethod: string;

  @IsMongoId({ message: 'courseId co phan tu la objectId' })
  @IsNotEmpty({ message: 'courseId khong duoc de trong' })
  courseId: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'curriculuId co phan tu la objectId' })
  @IsNotEmpty({ message: 'curriculum khong duoc de trong' })
  curriculumId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'totalStudent khong duoc de trong' })
  totalStudent: number;
}
