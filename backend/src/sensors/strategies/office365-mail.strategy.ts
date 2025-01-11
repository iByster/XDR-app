import { Injectable, Logger } from '@nestjs/common';
import { SensorStrategy } from './sensor-strategy.interface';
import { MicrosoftAuthService } from '../../auth/microsoft-auth.service';
import { Client } from '@microsoft/microsoft-graph-client';
import { EventTypes } from 'src/events/event.entity';

@Injectable()
export class Office365MailStrategy implements SensorStrategy {
  private readonly logger = new Logger(Office365MailStrategy.name);

  constructor(private readonly microsoftAuthService: MicrosoftAuthService) {}

  // Initialize Graph Client with the access token
  private getGraphClient(accessToken: string): Client {
    return Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  // Fetch all users from Microsoft Graph
  private async fetchAllUsers(graphClient: Client): Promise<any[]> {
    try {
      const response = await graphClient.api('/users').get();
      return response.value;
    } catch (error) {
      this.logger.error('Error fetching users from Microsoft Graph:', error);
      throw new Error('Unable to fetch users from Microsoft Graph');
    }
  }

  // Fetch emails with attachments for a specific user
  private async fetchEmailsWithAttachments(
    graphClient: Client,
    userId: string,
  ): Promise<any[]> {
    try {
      const response = await graphClient
        .api(`/users/${userId}/messages`)
        .expand('attachments')
        .get();

      return response.value;
    } catch (error) {
      if (error.statusCode === 404) {
        this.logger.warn(
          `No mailbox found for user: ${userId}. Ensure the user has a provisioned mailbox.`,
        );
      } else {
        this.logger.error('Error fetching emails for user:', error);
      }
      throw new Error(`Unable to fetch emails for user: ${userId}`);
    }
  }

  // Process sensor to fetch and organize email events
  async process(config: any): Promise<any[]> {
    if (config.auth) {
      this.microsoftAuthService.setCustomConfig(config.auth);
    }

    // Get access token
    const accessToken = await this.microsoftAuthService.getAccessToken();

    // Initialize Graph Client
    const graphClient = this.getGraphClient(accessToken);

    // Fetch all users
    const users = await this.fetchAllUsers(graphClient);

    const events: any[] = [];
    for (const user of users) {
      try {
        const emailEvents = await this.fetchEmailsWithAttachments(
          graphClient,
          user.id,
        );

        emailEvents.forEach((email: any) => {
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
            email.attachments.forEach((attachment: any) => {
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
      } catch (err) {
        this.logger.error(`Error processing emails for user: ${user.id}`, err);
      }
    }

    return events;
  }
}
