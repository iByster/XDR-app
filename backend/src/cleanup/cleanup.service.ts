import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventHandlerService } from 'src/events/event.service';
import { IncidentsService } from 'src/incident/incident.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    private readonly eventService: EventHandlerService,
    private readonly incidentService: IncidentsService,
  ) {}

  /**
   * Retention policy cron job
   * Runs daily at midnight to clean up events and incidents older than 30 days.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Running cleanup cron job...');

    const THIRTY_DAYS_AGO = new Date();
    THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

    try {
      const deletedEvents =
        await this.eventService.deleteOldEvents(THIRTY_DAYS_AGO);
      this.logger.log(`Deleted ${deletedEvents} events older than 30 days.`);

      const deletedIncidents =
        await this.incidentService.deleteOldIncidents(THIRTY_DAYS_AGO);
      this.logger.log(
        `Deleted ${deletedIncidents} incidents older than 30 days.`,
      );
    } catch (error) {
      this.logger.error('Error running cleanup cron job:', error);
    }
  }
}
