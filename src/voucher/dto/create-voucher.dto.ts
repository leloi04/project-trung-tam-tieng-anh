import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateVoucherDto {
  @IsNotEmpty({ message: 'code khong duoc de trong' })
  code: string;

  @IsNotEmpty({ message: 'type khong duoc de trong' })
  type: string;

  @IsNotEmpty({ message: 'value khong duoc de trong' })
  value: number;

  @IsNotEmpty({ message: 'description khong duoc de trong' })
  description: string;

  @IsNotEmpty({ message: 'validFrom khong duoc de trong' })
  validFrom: Date;

  @IsNotEmpty({ message: 'validUntil khong duoc de trong' })
  validUntil: Date;

  @IsOptional()
  maxUsage?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'appliedToStudent khong duoc de trong' })
  @IsMongoId({
    each: true,
    message: 'appliedToStudent co moi phan tu la objectId',
  })
  appliedToStudent?: mongoose.Schema.Types.ObjectId[];

  @IsNotEmpty({ message: 'appliedToCourse khong duoc de trong' })
  @IsMongoId({
    each: true,
    message: 'appliedToCourse co moi phan tu la objectId',
  })
  appliedToCourse: mongoose.Schema.Types.ObjectId[];

  @IsOptional()
  isActive?: boolean;
}
