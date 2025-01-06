import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EventHandlerService } from 'src/events/event.service';
import { IncidentsService } from 'src/incident/incident.service';
import { DetectionStrategyFactory } from './detection-strategy.factory';

@Injectable()
export class DetectionService {
  private readonly logger = new Logger(DetectionService.name);

  constructor(
    private readonly eventsService: EventHandlerService,
    private readonly incidentsService: IncidentsService,
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
      // Retrieve event details from Events Module
      const event = await this.eventsService.getEventById(eventId);

      if (!event) {
        this.logger.error(`Event with ID ${eventId} not found.`);
        return;
      }

      // Dynamically resolve detection strategy based on eventType
      const strategy = this.detectionStrategyFactory.getStrategy(event.type);

      if (!strategy) {
        this.logger.warn(
          `No detection strategy found for eventType: ${eventType}`,
        );
        return;
      }

      // Execute detection strategy
      const incident = await strategy.detect(event);

      // Save the generated incident to Incidents Module
      if (incident) {
        await this.incidentsService.createIncident(incident);
        this.logger.log(`Incident created for event ID ${eventId}`);
      }
    } catch (error) {
      // Log and handle the error to prevent RabbitMQ from retrying the message
      this.logger.error(`Error handling alert: ${error.message}`);
    }
  }
}
