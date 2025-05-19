import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Course } from 'src/courses/schemas/course.schema';
import { User } from 'src/users/schemas/user.schema';

class UserId {
  @Prop({ type: Object })
  _id: mongoose.Schema.Types.ObjectId;
}
export class Class {
  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop()
  year: number;

  @Prop()
  status: string;

  @Prop()
  description: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  teachers: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  students: mongoose.Schema.Types.ObjectId[];

  @Prop()
  studyMethod: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  courseId: mongoose.Schema.Types.ObjectId;
}
