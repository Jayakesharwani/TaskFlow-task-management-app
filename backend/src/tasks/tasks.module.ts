import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { EmailModule } from '../email/email.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    EmailModule,
    WeatherModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}