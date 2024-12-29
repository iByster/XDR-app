import { Module } from '@nestjs/common';
import { IncidentsService } from './incident.service';
import { SensorDbModule } from 'src/db/main-db.module';

@Module({
  imports: [SensorDbModule],
  providers: [IncidentsService],
  //   controllers: [IncidentsController],
  exports: [IncidentsService], // Allow access to the service from other modules
})
export class IncidentsModule {}
