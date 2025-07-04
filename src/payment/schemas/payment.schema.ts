import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Tuition } from 'src/tuition/schemas/tuition.schema';
import { User } from 'src/users/schemas/user.schema';
import { Voucher } from 'src/voucher/schemas/voucher.schema';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Tuition.name,
  })
  tuitionId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String })
  note?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Voucher.name })
  voucherId?: mongoose.Schema.Types.ObjectId;

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

export const PaymentSchema = SchemaFactory.createForClass(Payment);
