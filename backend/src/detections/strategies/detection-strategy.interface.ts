import { CreateIncidentDto } from 'src/incident/dto/create-incident.dto';
import { Event } from 'src/events/event.entity';
import { CreateRecommendationDto } from 'src/recommendations/dto/create-recommandation.dto';

export interface DetectionResult {
  incident: CreateIncidentDto;
  recommendations: CreateRecommendationDto[];
}

export interface DetectionStrategy {
  detect(event: Event): Promise<DetectionResult | null>;
}
