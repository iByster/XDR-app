import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  data: any;

  @IsNumber()
  eventId: number;
}
