import { Controller, Get } from '@nestjs/common';
import { IncidentsService } from './incident.service';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  async getAllIncidents() {
    // Fetch all incidents along with their related recommendations
    return await this.incidentsService.getAllIncidentsWithRecommendations();
  }
}
