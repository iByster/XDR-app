import { Injectable, Logger } from '@nestjs/common';
import { DetectionStrategy } from './detection-strategy.interface';
import { CreateIncidentDto } from 'src/incident/dto/create-incident.dto';
import { Event } from 'src/events/event.entity';
import { IncidentSeverity } from 'src/incident/incident.entity';

@Injectable()
export class EmailDetectionStrategy implements DetectionStrategy {
  private readonly logger = new Logger(EmailDetectionStrategy.name);

  async detect(event: Event): Promise<CreateIncidentDto | null> {
    this.logger.log(`Detecting incidents for email event ID: ${event.id}`);

    // Example detection logic
    const emailData = event.data;
    if (emailData.containsMaliciousLink) {
      return {
        title: 'Malicious Email Detected',
        description: `Email contains a link to a known malicious domain: ${emailData.maliciousLink}`,
        severity: IncidentSeverity.HIGH,
        relatedEventId: event.id,
      };
    }

    this.logger.log(
      `No malicious activity detected for email event ID: ${event.id}`,
    );
    return null;
  }
}
