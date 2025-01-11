import { Injectable, Logger } from '@nestjs/common';
import { SensorStrategy } from './sensor-strategy.interface';
import * as fs from 'fs';
import { join } from 'path';
import { EventTypes } from 'src/events/event.entity';

@Injectable()
export class MockOffice365MailStrategy implements SensorStrategy {
  private readonly logger = new Logger(MockOffice365MailStrategy.name);

  // Load the mock data from the local JSON file
  private async loadMockEmails(): Promise<any[]> {
    try {
      const filePath = join(__dirname, '../../mock-data/mock-emails.json');
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data).value;
    } catch (error) {
      this.logger.error('Error loading mock emails:', error);
      throw new Error('Failed to load mock emails.');
    }
  }

  // Process sensor to fetch and organize email events
  async process(): Promise<any[]> {
    this.logger.log('Processing mock Office365 emails...');

    const emailEvents: any[] = await this.loadMockEmails();

    const events: any[] = [];
    emailEvents.forEach((email) => {
      // Add email content event
      events.push({
        type: EventTypes.EmailContent,
        data: {
          subject: email.subject,
          sender: email.from,
          receiver: [...email.toRecipients, ...email.ccRecipients],
          body: email.bodyPreview,
        },
      });

      // Add attachment events (if any)
      if (email.attachments?.length) {
        email.attachments.forEach((attachment) => {
          events.push({
            type: EventTypes.EmailAttachments,
            data: {
              fileName: attachment.name,
              contentType: attachment.contentType,
              size: attachment.size,
              sender: email.from,
              receiver: [...email.toRecipients, ...email.ccRecipients],
            },
          });
        });
      }
    });

    return events;
  }
}
