import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reservation } from 'src/reservations/reservations.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  // https://docs.nestjs.com/techniques/database#relations
  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    cascade: true,
  })
  reservation: Reservation[];
}
