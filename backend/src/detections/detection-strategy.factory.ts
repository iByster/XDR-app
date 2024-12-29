import { Injectable, Logger } from '@nestjs/common';
import { DetectionStrategy } from './strategies/detection-strategy.interface';
import { EmailDetectionStrategy } from './strategies/email-detection.strategy';

@Injectable()
export class DetectionStrategyFactory {
  private readonly logger = new Logger(DetectionStrategyFactory.name);

  private readonly strategies: Map<string, DetectionStrategy>;

  constructor(
    private readonly emailDetectionStrategy: EmailDetectionStrategy, // Add more strategies here as needed
  ) {
    this.strategies = new Map<string, DetectionStrategy>();

    // Register strategies with their event types
    this.register('email', emailDetectionStrategy);
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
