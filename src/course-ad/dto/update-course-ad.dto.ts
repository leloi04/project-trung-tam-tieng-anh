import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseAdDto } from './create-course-ad.dto';

export class UpdateCourseAdDto extends PartialType(CreateCourseAdDto) {}
