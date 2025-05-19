import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
class Student {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  status: string;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

@Schema({ timestamps: true })
export class Course {
  @Prop()
  name: string;

  @Prop()
  ageGroup: string;

  @Prop()
  description: string;

  @Prop()
  maxStudent: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  teacher: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [Student], default: [] })
  registeredBy: Student[];

  @Prop()
  assignedClassId: string;

  @Prop()
  totalSessions: number;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  pricePerSession: number;

  @Prop()
  isOpen: boolean;

  @Prop()
  status: string;

  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  //   courseId: mongoose.Schema.Types.ObjectId;

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

export const CourseSchema = SchemaFactory.createForClass(Course);
