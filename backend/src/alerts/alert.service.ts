import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert, 'mainConnection')
    private readonly alertRepository: Repository<Alert>,
  ) {}

  // Create a new alert
  async createAlert(alertData: Partial<Alert>): Promise<Alert> {
    const alert = this.alertRepository.create(alertData);
    return await this.alertRepository.save(alert);
  }

  // Get all alerts
  async getAllAlerts(): Promise<Alert[]> {
    return await this.alertRepository.find({ relations: ['event'] });
  }

  // Get a single alert by ID
  async getAlertById(id: number): Promise<Alert> {
    return await this.alertRepository.findOne({
      where: { id },
      relations: ['event'],
    });
  }

  // Update an existing alert
  async updateAlert(id: number, updateData: Partial<Alert>): Promise<Alert> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new Error(`Alert with ID ${id} not found`);
    }
    Object.assign(alert, updateData);
    return await this.alertRepository.save(alert);
  }

  // Delete an alert by ID
  async deleteAlert(id: number): Promise<void> {
    await this.alertRepository.delete(id);
  }
}
