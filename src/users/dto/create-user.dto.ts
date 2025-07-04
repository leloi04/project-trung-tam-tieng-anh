import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty({ message: 'name khong duoc de trong' })
  name: string;

  @IsEmail({}, { message: 'email khong dung dinh dang' })
  @IsNotEmpty({ message: 'email khong duoc de trong' })
  email: string;

  @IsNotEmpty({ message: 'password khong duoc de trong' })
  password: string;

  @IsNotEmpty({ message: 'phone khong duoc de trong' })
  phone: number;

  @IsOptional()
  gender?: string;

  @IsMongoId({ message: 'phan tu la objectId' })
  @IsOptional()
  role?: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ each: true, message: 'chilren co moi phan tu la objectId' })
  @IsArray({ message: 'chilren co dinh dang la array' })
  @IsOptional()
  children?: mongoose.Schema.Types.ObjectId[];

  @IsMongoId({ each: true, message: 'parent co moi phan tu la objectId' })
  @IsArray({ message: 'parent co dinh dang la array' })
  @IsOptional()
  parent?: mongoose.Schema.Types.ObjectId[];

  @IsOptional()
  qualification?: string;

  @IsOptional()
  specialization?: string;

  @IsOptional()
  avatar?: string;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'name khong duoc de trong' })
  name: string;

  @IsEmail({}, { message: 'email khong dung dinh dang' })
  @IsNotEmpty({ message: 'email khong duoc de trong' })
  email: string;

  @IsNotEmpty({ message: 'password khong duoc de trong' })
  password: string;

  @IsNotEmpty({ message: 'phone khong duoc de trong' })
  phone: string;

  role: string;
}
