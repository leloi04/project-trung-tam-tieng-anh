import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { User } from 'src/users/schemas/user.schema';

export type ClassScheduleDocument = HydratedDocument<ClassSchedule>;

@Schema({ timestamps: true })
export class ClassSchedule {
  @Prop({ type: mongoose.Types.ObjectId, ref: Class.name })
  classId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ default: false })
  isCanceled: boolean;

  @Prop()
  studyMethod: string;

  @Prop()
  note?: string;

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

export const ClassScheduleSchema = SchemaFactory.createForClass(ClassSchedule);
