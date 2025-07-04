import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from 'src/courses/schemas/course.schema';

export type CourseAdDocument = HydratedDocument<CourseAd>;

@Schema({ timestamps: true })
export class CourseAd {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ enum: ['POPUP', 'SLIDER'], default: 'SLIDER' })
  type: 'POPUP' | 'SLIDER';

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  targetCourseId: mongoose.Schema.Types.ObjectId;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

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

export const CourseAdSchema = SchemaFactory.createForClass(CourseAd);
