import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
// https://stackoverflow.com/questions/65792347/circular-dependency-between-entities
import type { User as UserType } from 'src/users/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Reservation {
  @ApiProperty({
    description: 'The unique identifier for the reservation',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The ID of the movie being reserved',
    example: 123,
  })
  @Column()
  movieId: number;

  @ApiProperty({
    description: 'The date and time of the reservation',
    example: '2025-04-10T15:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Column()
  reservationDate: Date;

  @ApiProperty({
    description: 'The user who made the reservation',
    type: () => User,
  })
  // https://docs.nestjs.com/techniques/database#relations
  @ManyToOne(() => User)
  @JoinColumn()
  user: UserType;
}
