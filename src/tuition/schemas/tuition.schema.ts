import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { Course } from 'src/courses/schemas/course.schema';
import { User } from 'src/users/schemas/user.schema';
import { Voucher } from 'src/voucher/schemas/voucher.schema';

export type TuitionDocument = HydratedDocument<Tuition>;

@Schema({ timestamps: true })
export class Tuition {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  studentId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  courseId: mongoose.Schema.Types.ObjectId;

  // @Prop()
  // month: number;

  // @Prop()
  // year: number;

  // @Prop()
  // attended: number;

  @Prop()
  calculatedTuition: number;

  @Prop()
  amountPaid: number;

  @Prop()
  remaining: number;

  @Prop()
  isFullyPaid: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop()
  isDeleted: boolean;

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

export const TuitionSchema = SchemaFactory.createForClass(Tuition);
