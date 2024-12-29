import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventHandlerService } from './event.service';
import { EventDbModule } from 'src/db/event-db.module';

@Module({
  imports: [
    EventDbModule,
    // TypeOrmModule.forFeature([Event])
  ],
  providers: [EventHandlerService],
  exports: [],
})
export class EventsModule {}
