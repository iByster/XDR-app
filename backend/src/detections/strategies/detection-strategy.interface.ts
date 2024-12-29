import { CreateIncidentDto } from 'src/incident/dto/create-incident.dto';
// import { DetectionResultDTO } from '../dto/detection-result.dto';

export interface DetectionStrategy {
  detect(event: any): Promise<CreateIncidentDto>;
}
