import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EventHandlerService } from 'src/events/event.service';
import { IncidentsService } from 'src/incident/incident.service';
import { DetectionStrategyFactory } from './detection-strategy.factory';
import { RecommendationService } from 'src/recommendations/recommendation.service';
import { AlertService } from 'src/alerts/alert.service';
import { ActorService } from 'src/actors/actor.service';
import { ResourceService } from 'src/resources/resource.service';
import { IncidentSeverity } from 'src/incident/incident.entity';
import { calculateEventHash } from 'src/utils/calculateEventHash';

@Injectable()
export class DetectionService {
  private readonly logger = new Logger(DetectionService.name);

  constructor(
    private readonly eventsService: EventHandlerService,
    private readonly alertsService: AlertService,
    private readonly actorsService: ActorService,
    private readonly resourcesService: ResourceService,
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
        // Calculate event hash
        const eventHash = calculateEventHash(event.data);

        // Check if an incident with the same hash already exists
        const existingIncident =
          await this.incidentsService.findIncidentByHash(eventHash);

        if (existingIncident) {
          this.logger.log(
            `Incident with hash ${eventHash} already exists. Adding alert to existing incident.`,
          );

          // If incident exists, create a new alert and associate it with the existing incident
          const savedAlert = await this.alertsService.createAlert({
            ...result.alert,
            incident: existingIncident,
            eventId: event.id,
          });

          this.logger.log(`Alert created with ID ${savedAlert.id}`);
        } else {
          // If no incident exists, create a new incident
          this.logger.log(
            `No incident with hash ${eventHash} found. Creating new incident.`,
          );

          const newIncident = await this.incidentsService.createIncident({
            title: result.alert.title,
            description: result.alert.description,
            severity: IncidentSeverity[result.alert.severity],
            eventId: event.id,
            hash: eventHash,
          });

          this.logger.log(`New incident created with ID ${newIncident.id}`);

          // Create and associate alert with the new incident
          const savedAlert = await this.alertsService.createAlert({
            ...result.alert,
            incident: newIncident,
            eventId: event.id,
          });

          this.logger.log(`Alert created with ID ${savedAlert.id}`);

          // Create and associate actors with the new incident
          for (const actor of result.actors) {
            await this.actorsService.create({
              ...actor,
              incident: newIncident,
            });
          }

          this.logger.log(
            `Actors associated with incident ID ${newIncident.id}`,
          );

          // Create and associate resources with the new incident
          for (const resource of result.resources) {
            await this.resourcesService.create({
              ...resource,
              incident: newIncident,
            });
          }

          this.logger.log(
            `Resources associated with incident ID ${newIncident.id}`,
          );

          // Create and associate recommendations with the new incident
          for (const recommendation of result.recommendations) {
            await this.recommendationService.createRecommendation({
              ...recommendation,
              incidentId: newIncident.id,
            });
          }

          this.logger.log(
            `Recommendations created for incident ID ${newIncident.id}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error handling alert: ${error.message}`);
    }
  }
}
