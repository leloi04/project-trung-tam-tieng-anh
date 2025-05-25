import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { User } from 'src/users/schemas/user.schema';

export type AttendanceDocument = HydratedDocument<Attendance>;

class AttendInfo {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  // 'PRESENT' | 'ABSENT'
  @Prop()
  status: string;

  @Prop()
  reason: string;
}

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Class.name })
  classId: mongoose.Schema.Types.ObjectId;

  @Prop()
  date: Date;

  @Prop({ type: mongoose.Schema.Types.Array })
  studentAttendInfo: AttendInfo[];

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

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
