import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EventHandlerService } from 'src/events/event.service';
import { IncidentsService } from 'src/incident/incident.service';
import { DetectionStrategyFactory } from './detection-strategy.factory';
import { RecommendationService } from 'src/recommendations/recommendation.service';

@Injectable()
export class DetectionService {
  private readonly logger = new Logger(DetectionService.name);

  constructor(
    private readonly eventsService: EventHandlerService,
    private readonly incidentsService: IncidentsService,
    private readonly recommendationService: RecommendationService,
    private readonly detectionStrategyFactory: DetectionStrategyFactory,
  ) {}

  @RabbitSubscribe({
    exchange: 'alerts-exchange',
    routingKey: 'event.alert',
    queue: 'alerts.queue',
    queueOptions: { durable: true },
  })
  async handleAlert(msg: any) {
    this.logger.log(`Received alert: ${JSON.stringify(msg)}`);

    const { eventId, eventType } = msg;

    try {
      const event = await this.eventsService.getEventById(eventId);

      if (!event) {
        this.logger.error(`Event with ID ${eventId} not found.`);
        return;
      }

      const strategy = this.detectionStrategyFactory.getStrategy(event.type);

      if (!strategy) {
        this.logger.warn(
          `No detection strategy found for eventType: ${eventType}`,
        );
        return;
      }

      // Execute detection strategy
      const result = await strategy.detect(event);

      if (result) {
        const savedIncident = await this.incidentsService.createIncident(
          result.incident,
        );
        this.logger.log(`Incident created with ID ${savedIncident.id}`);

        // Save associated recommendations
        for (const recommendation of result.recommendations) {
          await this.recommendationService.createRecommendation({
            ...recommendation,
            incidentId: savedIncident.id,
          });
        }

        this.logger.log(
          `Recommendations created for incident ID ${savedIncident.id}`,
        );
      }
    } catch (error) {
      this.logger.error(`Error handling alert: ${error.message}`);
    }
  }
}
