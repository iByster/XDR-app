import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { SensorDbModule } from 'src/db/main-db.module';

@Module({
  imports: [SensorDbModule],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}
