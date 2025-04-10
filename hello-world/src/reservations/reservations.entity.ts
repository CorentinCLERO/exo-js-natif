import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
// https://stackoverflow.com/questions/65792347/circular-dependency-between-entities
import type { User as UserType } from 'src/users/users.entity';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

@Entity()
export class Reservation {
  @ApiProperty({ description: 'The unique identifier for the reservation', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The ID of the movie being reserved', example: 123 })
  @Column()
  movieId: number;

  @ApiProperty({ description: 'The date and time of the reservation', example: '2025-04-10T15:30:00.000Z', type: String, format: 'date-time' })
  @Column()
  reservationDate: Date;

  // https://docs.nestjs.com/techniques/database#relations
  // The User entity should also have ApiProperty decorators for this to display correctly in Swagger.
  @ApiProperty({ description: 'The user who made the reservation', type: () => User }) // Use type: () => User for relations
  @ManyToOne(() => User)
  @JoinColumn()
  user: UserType;
}
