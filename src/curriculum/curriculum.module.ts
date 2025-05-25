import { Module } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Curriculum, CurriculumSchema } from './schemas/curriculum.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Curriculum.name, schema: CurriculumSchema },
    ]),
  ],
  controllers: [CurriculumController],
  providers: [CurriculumService],
})
export class CurriculumModule {}
