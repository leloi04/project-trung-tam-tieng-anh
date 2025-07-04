import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { Class, ClassSchema } from 'src/class/schemas/class.schema';
import { ClassModule } from 'src/class/class.module';
import { TuitionModule } from 'src/tuition/tuition.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    ClassModule,
    TuitionModule,
    UsersModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [MongooseModule],
})
export class CoursesModule {}
