import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { EventsModule } from 'src/events/event.module';
import { IncidentsModule } from 'src/incident/incident.module';
import { DetectionService } from './detections.service';
import { DetectionStrategyFactory } from './detection-strategy.factory';
import { EmailDetectionStrategy } from './strategies/email-detection.strategy';

@Module({
  imports: [
    EventsModule,
    IncidentsModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [{ name: 'alerts-exchange', type: 'topic' }],
      uri: 'amqp://localhost',
    }),
  ],
  providers: [
    DetectionService,
    DetectionStrategyFactory,
    EmailDetectionStrategy,
  ],
  exports: [],
})
export class DetectionModule {}
