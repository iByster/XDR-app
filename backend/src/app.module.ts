import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
// import { DatabaseModule } from './db/db.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { SensorsModule } from './sensors/sensor.module';
import { DetectionModule } from './detections/detections.module';

@Module({
  imports: [
    AppConfigModule,
    // DatabaseModule,
    HttpModule,
    ScheduleModule.forRoot(),
    SensorsModule,
    DetectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
