import { IsString, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import { AlertSeverity } from '../alert.entity';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @IsNumber()
  @Min(1)
  eventId: number;
}
