import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CoursesModule } from './courses/courses.module';
import { ClassModule } from './class/class.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { FilesModule } from './files/files.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ClassScheduleModule } from './class-schedule/class-schedule.module';
import { TuitionModule } from './tuition/tuition.module';
import { VoucherModule } from './voucher/voucher.module';
import { PaymentModule } from './payment/payment.module';
import { CourseAdModule } from './course-ad/course-ad.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    CoursesModule,
    ClassModule,
    CurriculumModule,
    FilesModule,
    AttendanceModule,
    ClassScheduleModule,
    TuitionModule,
    VoucherModule,
    PaymentModule,
    CourseAdModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
