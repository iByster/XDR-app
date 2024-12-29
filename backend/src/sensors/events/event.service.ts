import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './event.entity'; // Updated to use EventStatus enum

@Injectable()
export class EventHandlerService {
  private readonly logger = new Logger(EventHandlerService.name);

  constructor(
    @InjectRepository(Event, 'eventConnection')
    private readonly eventRepository: Repository<Event>,
  ) {}

  // Handle completed sensor events
  @RabbitSubscribe({
    exchange: 'events-exchange',
    routingKey: 'sensor.completed',
    queue: 'sensor.completed.queue',
    queueOptions: {
      durable: true,
    },
  })
  async handleSensorCompleted(msg: any) {
    this.logger.log(`Received completed event: ${JSON.stringify(msg)}`);

    const { sensorId, output } = msg;

    try {
      // Save the event to the database
      const event = this.eventRepository.create({
        sensorId,
        status: EventStatus.COMPLETED, // Use enum value
        data: output,
        timestamp: new Date(),
      });
      await this.eventRepository.save(event);

      this.logger.log(
        `Sensor output saved to Events DB for sensorId: ${sensorId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to save sensor output: ${error.message}`);
    }
  }

  // Handle failed sensor events
  @RabbitSubscribe({
    exchange: 'events-exchange',
    routingKey: 'sensor.failed',
    queue: 'sensor.failed.queue',
    queueOptions: {
      durable: true, // Ensures the queue persists
    },
  })
  async handleSensorFailed(msg: any) {
    this.logger.log(`Received failed event: ${JSON.stringify(msg)}`);

    const { sensorId, error } = msg;

    try {
      // Log the failure event
      const event = this.eventRepository.create({
        sensorId,
        status: EventStatus.FAILED, // Use enum value
        data: { error },
        timestamp: new Date(),
      });
      await this.eventRepository.save(event);

      this.logger.warn(
        `Failure event saved to Events DB for sensorId: ${sensorId}`,
      );
    } catch (dbError) {
      this.logger.error(`Failed to save failure event: ${dbError.message}`);
    }
  }
}
