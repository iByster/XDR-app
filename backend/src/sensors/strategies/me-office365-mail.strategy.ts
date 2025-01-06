import { Injectable, Logger } from '@nestjs/common';
import { SensorStrategy } from './sensor-strategy.interface';
import { MicrosoftAuthService } from '../../auth/microsoft-auth.service';
import { Client } from '@microsoft/microsoft-graph-client';
import { EventTypes } from 'src/events/event.entity';

@Injectable()
export class MeOffice365MeMailStrategy implements SensorStrategy {
  private readonly logger = new Logger(MeOffice365MeMailStrategy.name);

  constructor(private readonly microsoftAuthService: MicrosoftAuthService) {}

  // Initialize Graph Client with the access token
  private getGraphClient(accessToken: string): Client {
    return Client.init({
      authProvider: (done) => {
        done(null, accessToken); // Pass the token to the client
      },
    });
  }

  // Fetch emails with attachments for the authenticated user using Graph Client
  private async fetchEmailsWithAttachments(
    accessToken: string,
  ): Promise<any[]> {
    const graphClient = this.getGraphClient(accessToken);

    try {
      const response = await graphClient
        .api('/me/messages')
        // .expand('attachments')
        .select('sender,subject')
        .get();

      return response.value;
    } catch (error) {
      this.logger.error('Error fetching emails for authenticated user:', error);
      throw new Error('Unable to fetch emails for authenticated user.');
    }
  }

  // Process sensor to fetch and organize email events for the authenticated user
  async process(config: any): Promise<any[]> {
    if (config.auth) {
      this.microsoftAuthService.setCustomConfig(config.auth);
    }

    // Get access token
    const accessToken = await this.microsoftAuthService.getAccessToken();

    // Fetch emails with attachments for the authenticated user
    const emailEvents = await this.fetchEmailsWithAttachments(accessToken);

    // Process and organize the email events
    const events: any[] = [];
    emailEvents.forEach((email: any) => {
      // Add email content event
      events.push({
        type: EventTypes.EmailContent,
        data: {
          subject: email.subject,
          sender: email.from,
          body: email.bodyPreview,
        },
      });

      // Add attachment events (if any)
      if (email.attachments?.length) {
        email.attachments.forEach((attachment: any) => {
          events.push({
            type: EventTypes.EmailAttachments,
            data: {
              fileName: attachment.name,
              contentType: attachment.contentType,
              size: attachment.size,
            },
          });
        });
      }
    });

    return events;
  }
}
