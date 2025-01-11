import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Sensor, SensorType } from './sensor.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { EditSensorDto } from './dto/edit-sensor.dto';
import { SensorContext } from './sensor-context';

const SENSOR_COOLDOWN = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours in milliseconds

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor, 'mainConnection')
    private readonly sensorRepository: Repository<Sensor>,
    private readonly sensorContext: SensorContext,
  ) {}

  getSensorTypes(): string[] {
    return Object.values(SensorType);
  }

  async createSensor(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const sensor = this.sensorRepository.create({ ...createSensorDto });
    return await this.sensorRepository.save(sensor);
  }

  async getAllSensors(): Promise<Sensor[]> {
    return await this.sensorRepository.find({ order: { id: 'ASC' } });
  }

  async getSensorById(id: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOneBy({ id });
    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${id} not found`);
    }
    return sensor;
  }

  async editSensor(id: number, editSensorDto: EditSensorDto): Promise<Sensor> {
    const sensor = await this.getSensorById(id);

    if (editSensorDto?.enabled !== undefined) {
      sensor.enabled = editSensorDto.enabled;
    }

    if (editSensorDto?.config) {
      sensor.config = editSensorDto.config;
    }

    if (editSensorDto?.lastExecutionTime) {
      sensor.lastExecutionTime = editSensorDto.lastExecutionTime;
    }

    if (editSensorDto?.isRunning !== undefined) {
      sensor.isRunning = editSensorDto.isRunning;
    }

    return await this.sensorRepository.save(sensor);
  }

  async deleteSensor(id: number): Promise<void> {
    const result = await this.sensorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sensor with ID ${id} not found`);
    }
  }

  async triggerSensor(id: number): Promise<any> {
    const sensor = await this.sensorRepository.findOneBy({ id });

    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${id} not found`);
    }

    // Set the appropriate strategy based on sensor type
    this.sensorContext.setStrategy(sensor.sensorType);

    // Process the sensor using its configuration
    return this.sensorContext.process(sensor.config, sensor.lastExecutionTime);
  }

  async getAllAvailableSensors(limit = 5): Promise<Sensor[]> {
    const availableSensors = await this.sensorRepository.find({
      where: {
        isRunning: false,
        enabled: true,
        // lastExecutionTime: LessThanOrEqual(SENSOR_COOLDOWN),
      },
      order: { lastExecutionTime: 'ASC' },
      take: limit,
    });

    return availableSensors;
  }
}
