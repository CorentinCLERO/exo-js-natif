import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './reservations.entity';
import { Between, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private readonly httpService: HttpService,
  ) {}

  async findAll(id: number) {
    return await this.reservationRepository.findBy({ user: { id } });
  }

  async create(id: number, reservationDate: string, movieId: number) {
    const startDateTime = new Date(
      new Date(reservationDate).getTime() - 2 * 60 * 60 * 1000,
    );
    const endDateTime = new Date(reservationDate);
    const isReserved = await this.reservationRepository.find({
      where: {
        user: { id },
        // https://typeorm.io/find-options#advanced-options
        reservationDate: Between(startDateTime, endDateTime),
      },
    });

    await firstValueFrom(
      this.httpService
        .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.MOVIE_TOKEN}` },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error?.response?.data);
            throw new BadRequestException("The movie does'nt exist");
          }),
        ),
    );

    if (isReserved.length > 0) {
      throw new BadRequestException('Time is already taken by a movie');
    }

    const createMovie = await this.reservationRepository.save({
      movieId,
      reservationDate,
      user: { id },
    });

    return createMovie;
  }

  async deleteById(userId: number, movieId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: movieId, user: { id: userId } },
    });

    if (!reservation) {
      throw new BadRequestException(
        'Delete reservation not found or unauthorized',
      );
    }

    return await this.reservationRepository.delete({ id: movieId });
  }
}
