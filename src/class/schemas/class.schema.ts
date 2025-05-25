import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from 'src/courses/schemas/course.schema';
import { Curriculum } from 'src/curriculum/schemas/curriculum.schema';
import { User } from 'src/users/schemas/user.schema';

export type ClassDocument = HydratedDocument<Class>;

class UserId {
  @Prop({ type: Object })
  _id: mongoose.Schema.Types.ObjectId;
}

@Schema({ timestamps: true })
export class Class {
  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop()
  year: number;

  @Prop()
  isOpen: boolean;

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Curriculum.name })
  curriculumId: mongoose.Schema.Types.ObjectId;

  @Prop()
  checkedStudents: string[];

  @Prop()
  totalStudent: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const ClassSchema = SchemaFactory.createForClass(Class);
