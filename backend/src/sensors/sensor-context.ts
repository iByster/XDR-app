import { Injectable, BadRequestException } from '@nestjs/common';
import { SensorType } from './sensor.entity';
import { Office365MailStrategy } from './strategies/office365-mail.strategy';
import { SensorStrategy } from './strategies/sensor-strategy.interface';

@Injectable()
export class SensorContext {
  private strategy: SensorStrategy;

  constructor(private readonly office365MailStrategy: Office365MailStrategy) {}

  setStrategy(sensorType: SensorType) {
    switch (sensorType) {
      case SensorType.OFFICE_365_MAILS:
        this.strategy = this.office365MailStrategy;
        break;
      default:
        throw new BadRequestException('Unknown sensor type');
    }
  }

  async process(config: any): Promise<any> {
    return this.strategy.process(config);
  }
}
