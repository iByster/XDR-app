import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SensorOrchestratorService } from '../orchestrator/sensor-orchestrator.service';

@Injectable()
export class OrchestratorScheduler {
  constructor(private readonly orchestrator: SensorOrchestratorService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async runOrchestration(): Promise<void> {
    await this.orchestrator.run();
  }
}
