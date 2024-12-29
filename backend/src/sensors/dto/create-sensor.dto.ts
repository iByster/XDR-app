import { IsEnum, IsBoolean, IsNotEmpty, IsObject } from 'class-validator';
import { SensorType } from '../sensor.entity';

export class CreateSensorDto {
  @IsEnum(SensorType, { message: 'sensorType must be a valid enum value' })
  sensorType: SensorType;

  @IsObject({ message: 'config must be a valid JSON object' })
  @IsNotEmpty({ message: 'config cannot be empty' })
  config: Record<string, any>;

  @IsBoolean({ message: 'enabled must be a boolean value' })
  enabled: boolean;
}
