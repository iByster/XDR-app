import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { EventsModule } from 'src/events/event.module';
import { IncidentsModule } from 'src/incident/incident.module';
import { DetectionService } from './detections.service';
import { DetectionStrategyFactory } from './detection-strategy.factory';
import { EmailContentDetectionStrategy } from './strategies/email-content-detection.strategy';
import { AttachmentDetectionStrategy } from './strategies/attachments-detection.strategy';
import { RecommendationModule } from 'src/recommendations/recommendation.module';
import { AlertModule } from 'src/alerts/alert.module';
import { ActorModule } from 'src/actors/actor.module';
import { ResourceModule } from 'src/resources/resource.module';

@Module({
  imports: [
    EventsModule,
    IncidentsModule,
    RecommendationModule,
    AlertModule,
    ActorModule,
    ResourceModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [{ name: 'alerts-exchange', type: 'topic' }],
      uri: 'amqp://localhost',
    }),
  ],
  providers: [
    DetectionService,
    DetectionStrategyFactory,
    EmailContentDetectionStrategy,
    AttachmentDetectionStrategy,
  ],
  exports: [],
})
export class DetectionModule {}
