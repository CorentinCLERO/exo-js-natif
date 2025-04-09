import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty()
  @IsNumber()
  movieId: number;

  @ApiProperty({ default: new Date().toISOString() })
  @IsString()
  time: string;
}

export class DeleteReservationDto {
  @ApiProperty()
  @IsNumber()
  movieId: number;
}
