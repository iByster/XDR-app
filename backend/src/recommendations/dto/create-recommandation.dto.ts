import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum RecommendationSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class CreateRecommendationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(RecommendationSeverity)
  severity: RecommendationSeverity;

  @IsOptional()
  @IsString()
  incidentId?: number;
}
