import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sensor } from '../sensor.entity';
import { SensorsService } from '../sensor.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class SensorOrchestratorService {
  private readonly logger = new Logger(SensorOrchestratorService.name);
  private readonly maxConcurrentSensors = 5;
  private activeSensors: Set<number> = new Set();

  constructor(
    private readonly sensorsService: SensorsService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Starting sensor orchestration...');

    const sensors = await this.sensorsService.getAllAvailableSensors(
      this.maxConcurrentSensors - this.activeSensors.size,
    );

    for (const sensor of sensors) {
      await this.allocateAndRunSensor(sensor);
    }

    this.logger.log('Sensor orchestration cycle complete.');
  }

  private async allocateAndRunSensor(sensor: Sensor): Promise<void> {
    if (this.activeSensors.size >= this.maxConcurrentSensors) {
      this.logger.warn('Max concurrent sensors reached. Skipping allocation.');
      return;
    }

    await this.sensorsService.editSensor(sensor.id, {
      isRunning: true,
      config: sensor.config,
    });

    this.activeSensors.add(sensor.id);

    this.logger.log(`Starting sensor for configuration ID ${sensor.id}`);
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Sensor execution timed out')),
          sensor.runtimeLimit * 1000,
        ),
      );

      const sensorPromise = this.sensorsService.triggerSensor(sensor.id);

      const events = await Promise.race([sensorPromise, timeoutPromise]);

      this.logger.log(
        `Sensor completed for configuration ID ${sensor.id}: ${JSON.stringify(events)}`,
      );

      for (const event of events) {
        await this.amqpConnection.publish(
          'events-exchange',
          'sensor.completed',
          {
            sensorId: sensor.id,
            output: event,
          },
        );
      }
    } catch (error) {
      this.logger.error(
        `Sensor failed for configuration ID ${sensor.id}: ${error.message}`,
      );

      const failureReason =
        error.message === 'Sensor execution timed out'
          ? 'TIMEOUT'
          : error.message;

      await this.amqpConnection.publish('events-exchange', 'sensor.failed', {
        sensorId: sensor.id,
        error: failureReason,
      });
    } finally {
      await this.sensorsService.editSensor(sensor.id, {
        isRunning: false,
        lastExecutionTime: new Date(),
        config: sensor.config,
      });
      this.activeSensors.delete(sensor.id);
    }
  }
}
