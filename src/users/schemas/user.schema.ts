import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { Role } from 'src/roles/Schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

class Absent {
  absentLength: number;

  classId: mongoose.Schema.Types.ObjectId;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  gender: string;

  @Prop()
  avatar: string;

  @Prop()
  phone: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: mongoose.Schema.Types.ObjectId;

  @Prop()
  refreshToken: string;

  @Prop({ type: [Absent] })
  absent: Absent[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  children: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  parent: User[];

  @Prop()
  qualification: string;

  @Prop()
  specialization: string;

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

export const UserSchema = SchemaFactory.createForClass(User);
