import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventHandlerService } from './event.service';
import { EventDbModule } from 'src/db/event-db.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    EventDbModule,
    // TypeOrmModule.forFeature([Event])
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        { name: 'events-exchange', type: 'topic' },
        { name: 'alerts-exchange', type: 'topic' },
      ],
      uri: 'amqp://localhost',
    }),
  ],
  providers: [EventHandlerService],
  exports: [EventHandlerService],
})
export class EventsModule {}
