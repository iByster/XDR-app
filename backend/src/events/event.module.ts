import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { EventDbModule } from 'src/db/event-db.module';
import { EventHandlerService } from './event.service';

@Module({
  imports: [
    EventDbModule,
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
