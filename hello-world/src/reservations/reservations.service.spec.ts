/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './reservations.entity';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { of, throwError } from 'rxjs';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let repository: Repository<Reservation>;
  let httpService: HttpService;

  // Mock des données
  const mockReservation: Partial<Reservation> = {
    id: 1,
    movieId: 123,
    reservationDate: new Date('2024-04-15T19:30:00Z'),
    user: {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      reservation: [],
    },
  };
  const mockReservations: Partial<Reservation>[] = [mockReservation];

  // Mock du repository
  const mockRepository = {
    findBy: jest.fn().mockResolvedValue(mockReservations),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(mockReservation),
    save: jest.fn().mockImplementation((reservation) =>
      Promise.resolve({
        id: 1,
        ...reservation,
      }),
    ),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  // Mock du HttpService
  const mockHttpService = {
    get: jest.fn().mockImplementation(() => {
      return of({
        data: { id: 123, title: 'Test Movie' },
        status: 200,
        statusText: 'OK',
        headers: {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        config: { headers: {} } as any,
      });
    }),
  };

  beforeEach(async () => {
    // Configurer l'environnement
    process.env.MOVIE_TOKEN = 'test-token';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    repository = module.get<Repository<Reservation>>(
      getRepositoryToken(Reservation),
    );
    httpService = module.get<HttpService>(HttpService);

    // Réinitialiser les mocks entre les tests
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Nettoyer l'environnement
    delete process.env.MOVIE_TOKEN;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all reservations for a user', async () => {
      // Arrange
      const userId = 1;

      // Act
      const result = await service.findAll(userId);

      // Assert
      expect(result).toEqual(mockReservations);
      expect(repository.findBy).toHaveBeenCalledWith({ user: { id: userId } });
    });
  });

  describe('create', () => {
    it('should create a new reservation', async () => {
      // Arrange
      const userId = 1;
      const reservationDate = '2024-04-15T19:30:00Z';
      const movieId = 123;

      // Act
      const result = await service.create(userId, reservationDate, movieId);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.movieId).toBe(movieId);
      expect(result.reservationDate).toBe(reservationDate);
      expect(repository.find).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          reservationDate: Between(expect.any(Date), expect.any(Date)),
        },
      });
      expect(httpService.get).toHaveBeenCalledWith(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        {
          headers: { Authorization: 'Bearer test-token' },
        },
      );
      expect(repository.save).toHaveBeenCalledWith({
        movieId,
        reservationDate,
        user: { id: userId },
      });
    });

    it('should throw BadRequestException if movie does not exist', async () => {
      // Arrange
      const userId = 1;
      const reservationDate = '2024-04-15T19:30:00Z';
      const movieId = 999; // Non-existent movie

      // Mock HTTP error
      mockHttpService.get.mockImplementationOnce(() => {
        return throwError(() => ({
          response: {
            data: {
              status_message: 'The resource you requested could not be found.',
            },
          },
        }));
      });

      // Act & Assert
      await expect(
        service.create(userId, reservationDate, movieId),
      ).rejects.toThrow(BadRequestException);
      expect(httpService.get).toHaveBeenCalledWith(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        {
          headers: { Authorization: 'Bearer test-token' },
        },
      );
    });

    it('should throw BadRequestException if time is already taken', async () => {
      // Arrange
      const userId = 1;
      const reservationDate = '2024-04-15T19:30:00Z';
      const movieId = 123;

      // Mock existing reservation
      mockRepository.find.mockResolvedValueOnce([mockReservation]);

      // Act & Assert
      await expect(
        service.create(userId, reservationDate, movieId),
      ).rejects.toThrow(BadRequestException);
      expect(repository.find).toHaveBeenCalled();
      expect(httpService.get).toHaveBeenCalled();
    });
  });

  describe('deleteById', () => {
    it('should delete a reservation by ID', async () => {
      // Arrange
      const userId = 1;
      const reservationId = 1;

      // Act
      await service.deleteById(userId, reservationId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: reservationId, user: { id: userId } },
      });
      expect(repository.delete).toHaveBeenCalledWith({ id: reservationId });
    });

    it('should throw BadRequestException if reservation not found', async () => {
      // Arrange
      const userId = 1;
      const reservationId = 999; // Non-existent reservation

      // Mock reservation not found
      mockRepository.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.deleteById(userId, reservationId)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: reservationId, user: { id: userId } },
      });
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
