import { Injectable, Logger } from '@nestjs/common';
import { DetectionStrategy } from './detection-strategy.interface';
import { CreateIncidentDto } from 'src/incident/dto/create-incident.dto';
import { Event } from 'src/events/event.entity';
import { IncidentSeverity } from 'src/incident/incident.entity';

@Injectable()
export class EmailContentDetectionStrategy implements DetectionStrategy {
  private readonly logger = new Logger(EmailContentDetectionStrategy.name);

  async detect(event: Event): Promise<CreateIncidentDto | null> {
    this.logger.log(`Running email detection for event ID: ${event.id}`);

    const emailData = event.data;

    // Example 1: Detect malicious links
    if (emailData.body.includes('http://malicious-domain.com')) {
      return {
        title: 'Malicious Link Detected',
        description: `Email contains a known malicious link: ${emailData.body}`,
        severity: IncidentSeverity.CRITICAL,
        relatedEventId: event.id,
      };
    }

    // Example 2: Detect phishing attempts
    if (
      emailData.subject.toLowerCase().includes('urgent') &&
      emailData.body.toLowerCase().includes('password')
    ) {
      return {
        title: 'Phishing Attempt Detected',
        description: `Email appears to be a phishing attempt with subject "${emailData.subject}".`,
        severity: IncidentSeverity.HIGH,
        relatedEventId: event.id,
      };
    }

    // Example 3: Detect unauthorized sender
    if (!emailData.sender.endsWith('@trusted-domain.com')) {
      return {
        title: 'Unauthorized Sender Detected',
        description: `Email sent by untrusted sender: ${emailData.sender}`,
        severity: IncidentSeverity.MEDIUM,
        relatedEventId: event.id,
      };
    }

    this.logger.log(`No issues detected for email event ID: ${event.id}`);
    return null;
  }
}
