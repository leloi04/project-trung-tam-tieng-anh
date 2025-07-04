import { Module } from '@nestjs/common';
import { ClassScheduleService } from './class-schedule.service';
import { ClassScheduleController } from './class-schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClassSchedule,
  ClassScheduleSchema,
} from './schemas/class-schedule.schema';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassSchedule.name, schema: ClassScheduleSchema },
    ]),
    ClassModule,
  ],
  controllers: [ClassScheduleController],
  providers: [ClassScheduleService],
})
export class ClassScheduleModule {}
