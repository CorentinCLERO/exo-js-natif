import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reservation } from 'src/reservations/reservations.entity';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

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

  // Note: Exposing password hashes via API is generally discouraged.
  // Consider adding `select: false` to the @Column decorator if you don't need to retrieve it often,
  // and potentially remove the @ApiProperty or adjust it if this field should not appear in API responses.
  @ApiProperty({
    description:
      'The hashed password of the user (typically not returned in responses)',
  })
  @Column()
  password: string;

  // https://docs.nestjs.com/techniques/database#relations
  @ApiProperty({
    description: 'List of reservations made by the user',
    type: () => [Reservation],
  }) // Use array type for OneToMany
  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    cascade: true,
  })
  reservation: Reservation[];
}
