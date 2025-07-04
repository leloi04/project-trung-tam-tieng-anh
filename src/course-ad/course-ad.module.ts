import { Module } from '@nestjs/common';
import { CourseAdService } from './course-ad.service';
import { CourseAdController } from './course-ad.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseAd, CourseAdSchema } from './schemas/course-ad.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseAd.name, schema: CourseAdSchema },
    ]),
  ],
  controllers: [CourseAdController],
  providers: [CourseAdService],
})
export class CourseAdModule {}
