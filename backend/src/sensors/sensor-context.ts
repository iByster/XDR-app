import { Injectable, BadRequestException } from '@nestjs/common';
import { SensorType } from './sensor.entity';
import { Office365MailStrategy } from './strategies/office365-mail.strategy';
import { SensorStrategy } from './strategies/sensor-strategy.interface';
import { MeOffice365MeMailStrategy } from './strategies/me-office365-mail.strategy';
import { MockOffice365MailStrategy } from './strategies/mock-office365-mail.strategy';

@Injectable()
export class SensorContext {
  private strategy: SensorStrategy;

  constructor(
    private readonly office365MailStrategy: Office365MailStrategy,
    private readonly meOffice365MailStrategy: MeOffice365MeMailStrategy,
    private readonly mockOffice365MailStrategy: MockOffice365MailStrategy,
  ) {}

  setStrategy(sensorType: SensorType) {
    switch (sensorType) {
      case SensorType.OFFICE_365_MAILS:
        this.strategy = this.office365MailStrategy;
        break;
      case SensorType.ME_OFFICE_365_MAILS:
        this.strategy = this.meOffice365MailStrategy;
        break;
      case SensorType.MOCK_OFFICE_365_MAILS:
        this.strategy = this.mockOffice365MailStrategy;
        break;
      default:
        throw new BadRequestException('Unknown sensor type');
    }
  }

  async process(config: any): Promise<any> {
    return this.strategy.process(config);
  }
}
