import { Injectable, Logger } from '@nestjs/common';
import {
  DetectionStrategy,
  DetectionResult,
} from './detection-strategy.interface';
import { Event } from 'src/events/event.entity';
import { DetectionRules } from './detection-rules.config';
import {
  CreateRecommendationDto,
  RecommendationSeverity,
} from 'src/recommendations/dto/create-recommandation.dto';
import { CreateActorDto } from 'src/actors/dto/create-actor.dto';
import { CreateResourceDto } from 'src/resources/dto/create-resource.dto';
import { AlertSeverity } from 'src/alerts/alert.entity';

@Injectable()
export class AttachmentDetectionStrategy implements DetectionStrategy {
  private readonly logger = new Logger(AttachmentDetectionStrategy.name);

  async detect(event: Event): Promise<DetectionResult | null> {
    this.logger.log(`Running attachment detection for event ID: ${event.id}`);

    const attachment = event.data;
    const recommendations: CreateRecommendationDto[] = [];

    const actors: CreateActorDto[] = [
      {
        type: 'email',
        data: {
          attacker: attachment.sender?.emailAddress?.address || '',
          defender:
            attachment.toRecipients
              ?.map((recipient: any) => recipient.emailAddress?.address)
              .join(', ') || '',
        },
        eventId: event.id,
      },
    ];

    const resources: CreateResourceDto[] = [
      {
        type: 'attachment',
        data: attachment,
        eventId: event.id,
      },
    ];

    // Check for dangerous content types
    if (DetectionRules.dangerousContentTypes.includes(attachment.contentType)) {
      recommendations.push({
        title: 'Remove Dangerous Attachment',
        description: `Consider removing the attachment "${attachment.fileName}" as it has a dangerous content type: ${attachment.contentType}`,
        severity: RecommendationSeverity.HIGH,
      });

      return {
        alert: {
          title: 'Dangerous Attachment Detected',
          description: `Attachment "${attachment.fileName}" has a dangerous content type: ${attachment.contentType}`,
          severity: AlertSeverity.HIGH,
          eventId: event.id,
        },
        recommendations,
        actors,
        resources,
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
        alert: {
          title: 'Suspicious File Extension Detected',
          description: `Attachment "${attachment.fileName}" has a suspicious file extension: .${fileExtension}`,
          severity: AlertSeverity.MEDIUM,
          eventId: event.id,
        },
        recommendations,
        actors,
        resources,
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
        alert: {
          title: 'Large Attachment Detected',
          description: `Attachment "${attachment.fileName}" exceeds the size limit of ${(DetectionRules.maxAttachmentSize / 1024 / 1024).toFixed(2)} MB.`,
          severity: AlertSeverity.LOW,
          eventId: event.id,
        },
        recommendations,
        actors,
        resources,
      };
    }

    this.logger.log(`No risks detected for attachment event ID: ${event.id}`);
    return null;
  }
}
