import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupModule } from './cleanup/cleanup.module';
import { DetectionModule } from './detections/detections.module';
import { SensorsModule } from './sensors/sensor.module';

@Module({
  imports: [
    AppConfigModule,
    HttpModule,
    ScheduleModule.forRoot(),
    SensorsModule,
    DetectionModule,
    CleanupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
