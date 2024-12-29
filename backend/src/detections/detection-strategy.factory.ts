import { Injectable, Logger } from '@nestjs/common';
import { DetectionStrategy } from './strategies/detection-strategy.interface';
import { EmailContentDetectionStrategy } from './strategies/email-content-detection.strategy';
import { EventTypes } from 'src/events/event.entity';
import { AttachmentDetectionStrategy } from './strategies/attachments-detection.strategy';

@Injectable()
export class DetectionStrategyFactory {
  private readonly logger = new Logger(DetectionStrategyFactory.name);

  private readonly strategies: Map<string, DetectionStrategy>;

  constructor(
    private readonly emailContentDetectionStrategy: EmailContentDetectionStrategy,
    private readonly attachmentDetectionStrategy: AttachmentDetectionStrategy,
  ) {
    this.strategies = new Map<string, DetectionStrategy>();

    // Register strategies with their event types
    this.register(EventTypes.EmailAttachments, emailContentDetectionStrategy);
    this.register(EventTypes.EmailContent, attachmentDetectionStrategy);
  }

  private register(eventType: string, strategy: DetectionStrategy): void {
    this.strategies.set(eventType, strategy);
  }

  getStrategy(eventType: string): DetectionStrategy | null {
    const strategy = this.strategies.get(eventType);
    if (!strategy) {
      this.logger.warn(`No strategy registered for eventType: ${eventType}`);
      return null;
    }
    return strategy;
  }
}
