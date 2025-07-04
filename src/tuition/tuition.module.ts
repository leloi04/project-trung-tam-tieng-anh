import { Module } from '@nestjs/common';
import { TuitionService } from './tuition.service';
import { TuitionController } from './tuition.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tuition, TuitionSchema } from './schemas/tuition.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tuition.name, schema: TuitionSchema }]),
  ],
  controllers: [TuitionController],
  providers: [TuitionService],
  exports: [MongooseModule],
})
export class TuitionModule {}
