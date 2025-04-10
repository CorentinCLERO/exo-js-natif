import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reservation } from '../reservations/reservations.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    description: 'The unique identifier for the user',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'The hashed password of the user (not returned in responses)',
  })
  @Column()
  password: string;

  // https://docs.nestjs.com/techniques/database#relations
  @ApiProperty({
    description: 'List of reservations made by the user',
    type: () => [Reservation],
  })
  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    cascade: true,
  })
  reservation: Reservation[];
}
