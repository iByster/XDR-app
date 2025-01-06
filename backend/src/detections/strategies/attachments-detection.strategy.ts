import { Injectable, Logger } from '@nestjs/common';
import { CreateIncidentDto } from 'src/incident/dto/create-incident.dto';
import { Event } from 'src/events/event.entity';
import { IncidentSeverity } from 'src/incident/incident.entity';
import { DetectionStrategy } from './detection-strategy.interface';
import { DetectionRules } from './detection-rules.config';

@Injectable()
export class AttachmentDetectionStrategy implements DetectionStrategy {
  private readonly logger = new Logger(AttachmentDetectionStrategy.name);

  async detect(event: Event): Promise<CreateIncidentDto | null> {
    this.logger.log(`Running attachment detection for event ID: ${event.id}`);

    const attachment = event.data; // 🔥 Expecting a single attachment per event

    // 🔍 Check for dangerous content types
    if (DetectionRules.dangerousContentTypes.includes(attachment.contentType)) {
      return {
        title: 'Dangerous Attachment Detected',
        description: `Attachment "${attachment.fileName}" has a dangerous content type: ${attachment.contentType}`,
        severity: IncidentSeverity.HIGH,
        relatedEventId: event.id,
      };
    }

    // 🔍 Check for suspicious file extensions
    const fileExtension = attachment.fileName.split('.').pop()?.toLowerCase();
    if (
      fileExtension &&
      DetectionRules.suspiciousFileExtensions.includes(fileExtension)
    ) {
      return {
        title: 'Suspicious File Extension Detected',
        description: `Attachment "${attachment.fileName}" has a suspicious file extension: .${fileExtension}`,
        severity: IncidentSeverity.MEDIUM,
        relatedEventId: event.id,
      };
    }

    // 🔍 Check for large attachment sizes
    if (attachment.size > DetectionRules.maxAttachmentSize) {
      return {
        title: 'Large Attachment Detected',
        description: `Attachment "${attachment.fileName}" exceeds the size limit of ${(
          DetectionRules.maxAttachmentSize /
          1024 /
          1024
        ).toFixed(2)} MB.`,
        severity: IncidentSeverity.LOW,
        relatedEventId: event.id,
      };
    }

    this.logger.log(`No risks detected for attachment event ID: ${event.id}`);
    return null;
  }
}
