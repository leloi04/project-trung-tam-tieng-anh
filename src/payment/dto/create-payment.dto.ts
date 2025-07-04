import { IsNotEmpty, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsMongoId()
  tuitionId: string;

  @IsNotEmpty()
  amount: number;

  @IsOptional()
  note?: string;

  @IsOptional()
  @IsMongoId()
  voucherId?: string;
}
