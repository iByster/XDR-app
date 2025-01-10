import { Module } from '@nestjs/common';
import { SensorDbModule } from 'src/db/main-db.module';
import { ResourceService } from './resource.service';

@Module({
  imports: [SensorDbModule],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class AlertModule {}
