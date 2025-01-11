import { Event } from 'src/events/event.entity';
import { CreateRecommendationDto } from 'src/recommendations/dto/create-recommandation.dto';
import { CreateActorDto } from 'src/actors/dto/create-actor.dto';
import { CreateResourceDto } from 'src/resources/dto/create-resource.dto';
import { CreateAlertDto } from 'src/alerts/dto/create-alert.dto';

export interface DetectionResult {
  alert: CreateAlertDto;
  recommendations: CreateRecommendationDto[];
  actors: CreateActorDto[];
  resources: CreateResourceDto[];
}

export interface DetectionStrategy {
  detect(event: Event): Promise<DetectionResult | null>;
}
