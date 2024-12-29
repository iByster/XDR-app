import { Injectable } from '@nestjs/common';
import { SensorStrategy } from './sensor-strategy.interface';
import { HttpService } from '@nestjs/axios';
import { MicrosoftAuthService } from '../../auth/microsoft-auth.service';
import { firstValueFrom } from 'rxjs';
import { EventTypes } from 'src/events/event.entity';

@Injectable()
export class Office365MailStrategy implements SensorStrategy {
  constructor(
    private readonly microsoftAuthService: MicrosoftAuthService,
    private readonly httpService: HttpService,
  ) {}

  // Fetch all users from Microsoft Graph
  private async fetchAllUsers(accessToken: string): Promise<any[]> {
    const graphUrl = 'https://graph.microsoft.com/v1.0/users';

    try {
      const response = await firstValueFrom(
        this.httpService.get(graphUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching users from Microsoft Graph', error.message);
      throw new Error('Unable to fetch users from Microsoft Graph');
    }
  }

  // Fetch emails and attachments for a single user
  private async fetchEmailsWithAttachments(
    accessToken: string,
    userId: string,
  ): Promise<any[]> {
    console.log(accessToken);
    const url = `https://graph.microsoft.com/v1.0/users/${userId}/messages?$top=10`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return response.data.value;
    } catch (error) {
      console.error('Error fetching emails for user:', error.message);
      throw new Error(`Unable to fetch emails for user: ${userId}`);
    }
  }

  // Process sensor to fetch and organize email events
  async process(config: any): Promise<any[]> {
    if (config.auth) {
      this.microsoftAuthService.setCustomConfig(config.auth);
    }

    const accessToken = await this.microsoftAuthService.getAccessToken();
    const users = await this.fetchAllUsers(accessToken);

    console.log(users);

    const events: any[] = [];
    for (const user of users) {
      try {
        const emailEvents = await this.fetchEmailsWithAttachments(
          accessToken,
          user.id,
        );

        // Separate logical data (emails and attachments)
        emailEvents.forEach((email: any) => {
          events.push({
            type: EventTypes.EmailContent,
            data: {
              subject: email.subject,
              sender: email.from,
              body: email.bodyPreview,
            },
          });

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
      } catch (err) {}
    }

    return events;
  }
}
