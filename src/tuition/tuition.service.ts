import { Injectable } from '@nestjs/common';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { UpdateTuitionDto } from './dto/update-tuition.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tuition, TuitionDocument } from './schemas/tuition.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Course, CourseDocument } from 'src/courses/schemas/course.schema';
import { IUser } from 'src/types/global.constanst';

@Injectable()
export class TuitionService {
  constructor(
    @InjectModel(Tuition.name)
    private TuitionModel: SoftDeleteModel<TuitionDocument>,
  ) {}

  create(createTuitionDto: CreateTuitionDto) {
    return 'This action adds a new tuition';
  }

  async getTuitionOfStudent(user: IUser) {
    const res = await this.TuitionModel.find({
      studentId: user._id,
      isFullyPaid: false,
    }).populate({
      path: 'courseId',
    });
    return res;
  }

  findAll() {
    return `This action returns all tuition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tuition`;
  }

  update(id: number, updateTuitionDto: UpdateTuitionDto) {
    return `This action updates a #${id} tuition`;
  }

  remove(id: number) {
    return `This action removes a #${id} tuition`;
  }
}
