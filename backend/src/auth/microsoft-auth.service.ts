import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as qs from 'qs';

interface MicrosoftAuthConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  scope: string;
}

@Injectable()
export class MicrosoftAuthService {
  private config: MicrosoftAuthConfig;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.config = {
      clientId: this.configService.get<string>('MICROSOFT_CLIENT_ID'),
      clientSecret: this.configService.get<string>('MICROSOFT_CLIENT_SECRET'),
      tenantId: this.configService.get<string>('MICROSOFT_TENANT_ID'),
      scope: this.configService.get<string>('MICROSOFT_SCOPE'),
    };
  }

  setCustomConfig(customConfig: MicrosoftAuthConfig): void {
    this.config = customConfig;
  }

  async getAccessToken(): Promise<string> {
    const { clientId, clientSecret, tenantId, scope } = this.config;

    if (!clientId || !clientSecret || !tenantId || !scope) {
      throw new HttpException(
        'Missing Microsoft authentication configuration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const params = {
      client_id: clientId,
      scope: scope,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(tokenUrl, qs.stringify(params), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching access token from Microsoft', error);
      throw new HttpException(
        'Unable to authenticate with Microsoft Graph API',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
