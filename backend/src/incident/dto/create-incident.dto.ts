import { IsString, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import { IncidentSeverity } from '../incident.entity';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(IncidentSeverity)
  severity: IncidentSeverity;

  @IsNumber()
  @Min(1)
  relatedEventId: number;
}
