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

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @Column()
  reservationDate: Date;

  // https://docs.nestjs.com/techniques/database#relations
  @ManyToOne(() => User)
  @JoinColumn()
  user: UserType;
}
