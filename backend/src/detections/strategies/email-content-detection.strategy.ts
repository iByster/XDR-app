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
export class EmailContentDetectionStrategy implements DetectionStrategy {
  private readonly logger = new Logger(EmailContentDetectionStrategy.name);

  async detect(event: Event): Promise<DetectionResult | null> {
    this.logger.log(`Running email detection for event ID: ${event.id}`);

    const emailData = event.data;
    const emailBody = this.extractBodyContent(emailData);
    const emailSubject = emailData.subject.toLowerCase();
    const recommendations: CreateRecommendationDto[] = [];

    // Detect suspicious keywords
    const hasSuspiciousKeywords = DetectionRules.suspiciousKeywords.some(
      (keyword) =>
        emailBody.includes(keyword) || emailSubject.includes(keyword),
    );

    if (hasSuspiciousKeywords) {
      recommendations.push({
        title: 'Educate Users on Phishing',
        description: `Consider providing training to users on recognizing phishing attempts.`,
        incidentId: null,
        severity: RecommendationSeverity.HIGH,
      });

      return {
        incident: {
          title: 'Phishing Attempt Detected',
          description: `Suspicious content detected in email with subject: "${emailData.subject}"`,
          severity: IncidentSeverity.HIGH,
          relatedEventId: event.id,
        },
        recommendations,
      };
    }

    // Detect unauthorized sender
    if (!this.isSenderAllowed(emailData.sender.emailAddress.address)) {
      recommendations.push({
        title: 'Block Unauthorized Sender',
        description: `Consider blocking the sender ${emailData.sender.emailAddress.address}.`,
        incidentId: null,
        severity: RecommendationSeverity.MEDIUM,
      });

      return {
        incident: {
          title: 'Unauthorized Sender Detected',
          description: `Email sent by unauthorized sender: ${emailData.sender.emailAddress.address}`,
          severity: IncidentSeverity.MEDIUM,
          relatedEventId: event.id,
        },
        recommendations,
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
