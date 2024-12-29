import { Injectable } from '@nestjs/common';
import { SensorStrategy } from './sensor-strategy.interface';
import { HttpService } from '@nestjs/axios';
import { MicrosoftAuthService } from '../../auth/microsoft-auth.service';
import { firstValueFrom } from 'rxjs';

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

  // Fetch emails for multiple users in a batch request
  private async fetchEmailsInBatch(
    accessToken: string,
    userEmails: string[],
  ): Promise<any[]> {
    const batchUrl = 'https://graph.microsoft.com/v1.0/$batch';

    // Prepare requests for each user’s messages
    const requests = userEmails.map((email, index) => ({
      id: `${index + 1}`,
      method: 'GET',
      url: `/users/${email}/messages?$top=10`, // Adjust query parameters as needed
    }));

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          batchUrl,
          { requests },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      // Map responses to each user's emails
      return response.data.responses.map((res: any) => res.body.value);
    } catch (error) {
      console.error(
        'Error fetching emails in batch from Microsoft Graph',
        error.message,
      );
      throw new Error('Unable to fetch emails in batch from Microsoft Graph');
    }
  }

  // Main processing method that fetches emails for all users
  async process(config: any): Promise<any> {
    // Use custom auth config if provided in the sensor config
    if (config.auth) {
      this.microsoftAuthService.setCustomConfig(config.auth);
    }

    const accessToken = await this.microsoftAuthService.getAccessToken();
    // Step 1: Fetch all users
    const users = await this.fetchAllUsers(accessToken);
    const userEmails = users.map((user) => user.userPrincipalName); // Get user emails from users list

    // Step 2: Batch fetch emails for all users
    const emails = await this.fetchEmailsInBatch(accessToken, userEmails);
    return emails;
  }
}
