import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateActorDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  data: any;

  @IsNumber()
  eventId: number;
}
