import { Module } from '@nestjs/common';
import { IncidentsService } from './incident.service';
import { SensorDbModule } from 'src/db/main-db.module';
import { IncidentsController } from './incident.controller';

@Module({
  imports: [SensorDbModule],
  providers: [IncidentsService],
  controllers: [IncidentsController],
  exports: [IncidentsService],
})
export class IncidentsModule {}
