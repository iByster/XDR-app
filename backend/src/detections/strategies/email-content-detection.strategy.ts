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
export class EmailContentDetectionStrategy implements DetectionStrategy {
  private readonly logger = new Logger(EmailContentDetectionStrategy.name);

  async detect(event: Event): Promise<DetectionResult | null> {
    this.logger.log(`Running email detection for event ID: ${event.id}`);

    const emailData = event.data;
    const emailBody = this.extractBodyContent(emailData);
    const emailSubject = emailData.subject.toLowerCase();
    const recommendations: CreateRecommendationDto[] = [];

    // Extract Actors
    const actors: CreateActorDto[] = [
      {
        type: 'email',
        data: {
          attacker: emailData.sender?.emailAddress?.address || '',
          defender:
            emailData.toRecipients
              ?.map((recipient: any) => recipient.emailAddress?.address)
              .join(', ') || '',
        },
        eventId: event.id,
      },
    ];

    // Extract Resource (Email Content)
    const resources: CreateResourceDto[] = [
      {
        type: 'email-content',
        data: { emailBody, emailSubject },
        eventId: event.id,
      },
    ];

    // Detect suspicious keywords
    const hasSuspiciousKeywords = DetectionRules.suspiciousKeywords.some(
      (keyword) =>
        emailBody.includes(keyword) || emailSubject.includes(keyword),
    );

    if (hasSuspiciousKeywords) {
      recommendations.push({
        title: 'Educate Users on Phishing',
        description: `Consider providing training to users on recognizing phishing attempts.`,
        severity: RecommendationSeverity.HIGH,
      });

      return {
        alert: {
          title: 'Phishing Attempt Detected',
          description: `Suspicious content detected in email with subject: "${emailData.subject}"`,
          severity: AlertSeverity.HIGH,
          eventId: event.id,
        },
        recommendations,
        actors,
        resources,
      };
    }

    // Detect unauthorized sender
    if (!this.isSenderAllowed(emailData.sender.emailAddress.address)) {
      recommendations.push({
        title: 'Block Unauthorized Sender',
        description: `Consider blocking the sender ${emailData.sender.emailAddress.address}.`,
        severity: RecommendationSeverity.MEDIUM,
      });

      return {
        alert: {
          title: 'Unauthorized Sender Detected',
          description: `Email sent by unauthorized sender: ${emailData.sender.emailAddress.address}`,
          severity: AlertSeverity.MEDIUM,
          eventId: event.id,
        },
        recommendations,
        actors,
        resources,
      };
    }

    this.logger.log(`No issues detected for email event ID: ${event.id}`);
    return null;
  }

  private extractBodyContent(emailData: any): string {
    if (emailData.body && emailData.body.content) {
      return emailData.body.contentType === 'html'
        ? this.stripHtmlTags(emailData.body.content)
        : emailData.body.content;
    }
    return '';
  }

  private stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, ''); // Remove HTML tags
  }

  private isSenderAllowed(email: string): boolean {
    return DetectionRules.allowedDomains.some((domain) =>
      email.endsWith(domain),
    );
  }
}
