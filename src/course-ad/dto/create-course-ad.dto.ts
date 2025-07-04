import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCourseAdDto {
  @IsNotEmpty({ message: 'title khong duoc de trong' })
  title: string;

  @IsNotEmpty({ message: 'description khong duoc de trong' })
  description?: string;

  @IsNotEmpty({ message: 'imageUrl khong duoc de trong' })
  imageUrl: string;

  @IsNotEmpty({ message: 'type khong duoc de trong' })
  type: 'POPUP' | 'SLIDER';

  @IsNotEmpty({ message: 'targetCourseId khong duoc de trong' })
  targetCourseId?: string;

  @IsNotEmpty({ message: 'startDate khong duoc de trong' })
  startDate: Date;

  @IsNotEmpty({ message: 'endDate khong duoc de trong' })
  endDate: Date;
}
