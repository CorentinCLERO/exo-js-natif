import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: 'ID of the movie to reserve',
    minimum: 1,
    required: true,
    type: Number,
  })
  @IsNumber({}, { message: 'Movie ID must be a number' })
  @IsNotEmpty({ message: 'Movie ID is required' })
  @IsPositive({ message: 'Movie ID must be a positive number' })
  movieId: number;

  @ApiProperty({
    description: 'Desired date and time for the movie reservation',
    default: new Date().toISOString(),
    format: 'date-time',
    required: true,
    type: String,
  })
  @IsString()
  time: string;
}

export class DeleteReservationDto {
  @ApiProperty({
    description: 'ID of the movie to reserve',
    minimum: 1,
    required: true,
    type: Number,
  })
  @IsNumber({}, { message: 'Movie ID must be a number' })
  @IsNotEmpty({ message: 'Movie ID is required' })
  @IsPositive({ message: 'Movie ID must be a positive number' })
  movieId: number;
}
