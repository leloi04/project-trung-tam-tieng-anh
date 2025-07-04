import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { Course } from 'src/courses/schemas/course.schema';
import { User } from 'src/users/schemas/user.schema';

export type VoucherDocument = HydratedDocument<Voucher>;

@Schema({ timestamps: true })
export class Voucher {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ enum: ['PERCENT', 'FIXED'], required: true })
  type: 'PERCENT' | 'FIXED';

  @Prop({ required: true })
  value: number;

  @Prop()
  description: string;

  @Prop()
  validFrom: Date;

  @Prop()
  validUntil: Date;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop()
  maxUsage: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name, default: [] })
  appliedToStudent: mongoose.Schema.Types.ObjectId[]; // optional: học sinh cụ thể

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Course.name,
    default: [],
  })
  appliedToCourse: mongoose.Schema.Types.ObjectId[]; // optional: khoá học cụ thể

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object, ref: User.name, default: [] })
  usageBy: {
    userId: mongoose.Schema.Types.ObjectId;
  };

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

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
