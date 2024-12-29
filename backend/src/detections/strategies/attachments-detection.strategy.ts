import { Injectable, Logger } from '@nestjs/common';
import { CreateIncidentDto } from 'src/incident/dto/create-incident.dto';
import { Event } from 'src/events/event.entity';
import { IncidentSeverity } from 'src/incident/incident.entity';
import { DetectionStrategy } from './detection-strategy.interface';

@Injectable()
export class AttachmentDetectionStrategy implements DetectionStrategy {
  private readonly logger = new Logger(AttachmentDetectionStrategy.name);

  private readonly dangerousContentTypes = [
    'application/x-msdownload', // Executable files
    'application/x-sh', // Shell scripts
    'application/x-bat', // Batch files
    'application/x-python', // Python scripts
  ];

  private readonly suspiciousFileExtensions = ['exe', 'bat', 'sh', 'js', 'vbs'];

  private readonly maxAttachmentSize = 10 * 1024 * 1024; // 10 MB

  async detect(event: Event): Promise<CreateIncidentDto | null> {
    this.logger.log(`Running attachment detection for event ID: ${event.id}`);

    const attachmentData = event.data;

    // Check for dangerous content types
    if (this.dangerousContentTypes.includes(attachmentData.contentType)) {
      return {
        title: 'Dangerous Attachment Detected',
        description: `Attachment "${attachmentData.fileName}" has a dangerous content type: ${attachmentData.contentType}`,
        severity: IncidentSeverity.HIGH,
        relatedEventId: event.id,
      };
    }

    // Check for suspicious file extensions
    const fileExtension = attachmentData.fileName
      .split('.')
      .pop()
      ?.toLowerCase();
    if (
      fileExtension &&
      this.suspiciousFileExtensions.includes(fileExtension)
    ) {
      return {
        title: 'Suspicious File Extension Detected',
        description: `Attachment "${attachmentData.fileName}" has a suspicious file extension: .${fileExtension}`,
        severity: IncidentSeverity.MEDIUM,
        relatedEventId: event.id,
      };
    }

    // Check for large attachment sizes
    if (attachmentData.size > this.maxAttachmentSize) {
      return {
        title: 'Large Attachment Detected',
        description: `Attachment "${attachmentData.fileName}" exceeds the size limit (${(this.maxAttachmentSize / 1024 / 1024).toFixed(2)} MB).`,
        severity: IncidentSeverity.LOW,
        relatedEventId: event.id,
      };
    }

    this.logger.log(`No risks detected for attachment event ID: ${event.id}`);
    return null;
  }
}
