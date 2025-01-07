import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup.service';
import { EventsModule } from 'src/events/event.module';
import { IncidentsModule } from 'src/incident/incident.module';

@Module({
  imports: [EventsModule, IncidentsModule],
  providers: [CleanupService],
})
export class CleanupModule {}
