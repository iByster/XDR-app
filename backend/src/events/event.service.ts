import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './event.entity';

@Injectable()
export class EventHandlerService {
  private readonly logger = new Logger(EventHandlerService.name);

  constructor(
    @InjectRepository(Event, 'eventConnection')
    private readonly eventRepository: Repository<Event>,
    private readonly amqpConnection: AmqpConnection, // RabbitMQ connection
  ) {}

  // async createEvent(createEventDto: CreateEventDto): Promise<Event> {
  //   const event = this.eventRepository.create(createEventDto);
  //   return this.eventRepository.save(event);
  // }

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async getEventById(id: number): Promise<Event> {
    return this.eventRepository.findOneBy({ id });
  }

  // async updateEvent(
  //   id: number,
  //   updateEventDto: UpdateEventDto,
  // ): Promise<Event> {
  //   await this.eventRepository.update(id, updateEventDto);
  //   return this.getEventById(id);
  // }

  async deleteEvent(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }

  @RabbitSubscribe({
    exchange: 'events-exchange',
    routingKey: 'sensor.completed',
    queue: 'sensor.completed.queue',
    queueOptions: { durable: true },
  })
  async handleSensorCompleted(msg: any) {
    this.logger.log(`Received completed event: ${JSON.stringify(msg)}`);
    const { sensorId, output } = msg;

    try {
      // Save the event to the Events DB
      const event = this.eventRepository.create({
        sensorId,
        status: EventStatus.COMPLETED,
        data: output,
        timestamp: new Date(),
      });
      await this.eventRepository.save(event);

      this.logger.log(`Event saved for sensorId: ${sensorId}`);

      // Publish alert to alerts-exchange
      await this.amqpConnection.publish('alerts-exchange', 'event.alert', {
        sensorId,
        eventId: event.id,
        data: output,
      });

      this.logger.log(`Alert published for sensorId: ${sensorId}`);
    } catch (error) {
      this.logger.error(`Failed to handle sensor completed: ${error.message}`);
    }
  }

  @RabbitSubscribe({
    exchange: 'events-exchange',
    routingKey: 'sensor.failed',
    queue: 'sensor.failed.queue',
    queueOptions: { durable: true },
  })
  async handleSensorFailed(msg: any) {
    this.logger.log(`Received failed event: ${JSON.stringify(msg)}`);
    const { sensorId, error } = msg;

    try {
      // Save the failed event to the Events DB
      const event = this.eventRepository.create({
        sensorId,
        status: EventStatus.FAILED,
        data: { error },
        timestamp: new Date(),
      });
      await this.eventRepository.save(event);

      this.logger.warn(`Failure event saved for sensorId: ${sensorId}`);
    } catch (dbError) {
      this.logger.error(`Failed to save failure event: ${dbError.message}`);
    }
  }
}
