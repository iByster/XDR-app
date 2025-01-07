import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Incident } from './incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident, 'mainConnection')
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  async createIncident(
    createIncidentDto: CreateIncidentDto,
  ): Promise<Incident> {
    const incident = this.incidentRepository.create(createIncidentDto);
    return this.incidentRepository.save(incident);
  }

  async getAllIncidents(): Promise<Incident[]> {
    return this.incidentRepository.find();
  }

  async getIncidentById(id: number): Promise<Incident> {
    return this.incidentRepository.findOneBy({ id });
  }

  async updateIncident(
    id: number,
    updateData: Partial<Incident>,
  ): Promise<Incident> {
    await this.incidentRepository.update(id, updateData);
    return this.getIncidentById(id);
  }

  async deleteIncident(id: number): Promise<void> {
    await this.incidentRepository.delete(id);
  }

  async getAllIncidentsWithRecommendations(): Promise<Incident[]> {
    return await this.incidentRepository.find({
      relations: ['recommendations'],
    });
  }

  async deleteOldIncidents(date: Date): Promise<number> {
    const result = await this.incidentRepository.delete({
      createdAt: LessThan(date),
    });
    return result.affected || 0;
  }
}
