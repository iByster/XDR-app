import { Injectable, Logger } from '@nestjs/common';
import {
  DetectionStrategy,
  DetectionResult,
} from './detection-strategy.interface';
import { CreateIncidentDto } from 'src/incident/dto/create-incident.dto';
import { Event } from 'src/events/event.entity';
import { IncidentSeverity } from 'src/incident/incident.entity';
import { DetectionRules } from './detection-rules.config';
import {
  CreateRecommendationDto,
  RecommendationSeverity,
} from 'src/recommendations/dto/create-recommandation.dto';

@Injectable()
export class AttachmentDetectionStrategy implements DetectionStrategy {
  private readonly logger = new Logger(AttachmentDetectionStrategy.name);

  async detect(event: Event): Promise<DetectionResult | null> {
    this.logger.log(`Running attachment detection for event ID: ${event.id}`);

    const attachment = event.data; // Expecting a single attachment per event
    const recommendations: CreateRecommendationDto[] = [];

    // Check for dangerous content types
    if (DetectionRules.dangerousContentTypes.includes(attachment.contentType)) {
      recommendations.push({
        title: 'Remove Dangerous Attachment',
        description: `Consider removing the attachment "${attachment.fileName}" as it has a dangerous content type: ${attachment.contentType}`,
        severity: RecommendationSeverity.HIGH,
      });

      return {
        incident: {
          title: 'Dangerous Attachment Detected',
          description: `Attachment "${attachment.fileName}" has a dangerous content type: ${attachment.contentType}`,
          severity: IncidentSeverity.HIGH,
          relatedEventId: event.id,
        },
        recommendations,
      };
    }

    // Check for suspicious file extensions
    const fileExtension = attachment.fileName.split('.').pop()?.toLowerCase();
    if (
      fileExtension &&
      DetectionRules.suspiciousFileExtensions.includes(fileExtension)
    ) {
      recommendations.push({
        title: 'Investigate Suspicious File',
        description: `Check the attachment "${attachment.fileName}" as it has a suspicious file extension: .${fileExtension}`,
        severity: RecommendationSeverity.MEDIUM,
      });

      return {
        incident: {
          title: 'Suspicious File Extension Detected',
          description: `Attachment "${attachment.fileName}" has a suspicious file extension: .${fileExtension}`,
          severity: IncidentSeverity.MEDIUM,
          relatedEventId: event.id,
        },
        recommendations,
      };
    }

    // Check for large attachment sizes
    if (attachment.size > DetectionRules.maxAttachmentSize) {
      recommendations.push({
        title: 'Limit Large Attachments',
        description: `Consider limiting attachments to below ${(DetectionRules.maxAttachmentSize / 1024 / 1024).toFixed(2)} MB.`,
        incidentId: null,
        severity: RecommendationSeverity.MEDIUM,
      });

      return {
        incident: {
          title: 'Large Attachment Detected',
          description: `Attachment "${attachment.fileName}" exceeds the size limit of ${(DetectionRules.maxAttachmentSize / 1024 / 1024).toFixed(2)} MB.`,
          severity: IncidentSeverity.LOW,
          relatedEventId: event.id,
        },
        recommendations,
      };
    }

    this.logger.log(`No risks detected for attachment event ID: ${event.id}`);
    return null;
  }
}
