import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfidentialClientApplication } from '@azure/msal-node';

interface MicrosoftAuthConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  scope: string;
}

@Injectable()
export class MicrosoftAuthService {
  private config: MicrosoftAuthConfig;
  private msalClient: ConfidentialClientApplication;

  constructor(private configService: ConfigService) {
    this.config = {
      clientId: this.configService.get<string>('MICROSOFT_CLIENT_ID'),
      clientSecret: this.configService.get<string>('MICROSOFT_CLIENT_SECRET'),
      tenantId: this.configService.get<string>('MICROSOFT_TENANT_ID'),
      scope: this.configService.get<string>('MICROSOFT_SCOPE'),
    };

    // Initialize MSAL Confidential Client
    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: this.config.clientId,
        authority: `https://login.microsoftonline.com/${this.config.tenantId}`,
        clientSecret: this.config.clientSecret,
      },
    });
  }

  setCustomConfig(customConfig: MicrosoftAuthConfig): void {
    this.config = customConfig;

    // Update the MSAL Client with the new config
    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: this.config.clientId,
        authority: `https://login.microsoftonline.com/${this.config.tenantId}`,
        clientSecret: this.config.clientSecret,
      },
    });
  }

  // Method to get an access token using Client Credentials Flow
  async getAccessToken(): Promise<string> {
    try {
      const result = await this.msalClient.acquireTokenByClientCredential({
        scopes: [this.config.scope],
      });

      if (!result || !result.accessToken) {
        throw new HttpException(
          'Failed to acquire access token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return result.accessToken;
    } catch (error) {
      console.error('Error fetching access token from Microsoft', error);
      throw new HttpException(
        'Unable to authenticate with Microsoft Graph API',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
