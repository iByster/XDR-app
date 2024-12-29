import {
  IsBoolean,
  IsOptional,
  IsObject,
  IsNotEmpty,
  IsDate,
} from 'class-validator';

export class EditSensorDto {
  @IsOptional()
  @IsObject({ message: 'config must be a valid JSON object' })
  @IsNotEmpty({ message: 'config cannot be empty' })
  config: Record<string, any>;

  @IsOptional()
  @IsBoolean({ message: 'enabled must be a boolean value' })
  enabled?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isRunning must be a boolean value' })
  isRunning?: boolean;

  @IsOptional()
  @IsDate({ message: 'lastExecutionTime must be a valid date' })
  lastExecutionTime?: Date;
}
