/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './reservations.dto';
import { Reservation } from './reservations.entity';

// Mock pour JwtAuthGuard
jest.mock('../auth/auth.guard.ts', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  // Mock des données
  const mockUser = { sub: 1, email: 'test@example.com' };
  const mockReservation: Partial<Reservation> = {
    id: 1,
    movieId: 123,
    reservationDate: new Date('2024-04-15T19:30:00Z'),
  };
  const mockReservations: Partial<Reservation>[] = [
    mockReservation,
    {
      id: 2,
      movieId: 456,
      reservationDate: new Date('2024-04-16T20:00:00Z'),
    },
  ];

  // Mock du service
  const mockReservationsService = {
    findAll: jest
      .fn()
      .mockImplementation((): Promise<Partial<Reservation>[]> => {
        return Promise.resolve(mockReservations);
      }),
    create: jest
      .fn()
      .mockImplementation((userId: number, time: string, movieId: number) => {
        return Promise.resolve({
          id: 1,
          movieId: movieId,
          reservationDate: time,
          user: { id: userId },
        });
      }),
    deleteById: jest.fn().mockImplementation(() => {
      return Promise.resolve();
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of reservations', async () => {
      // Arrange
      const req = { user: mockUser };

      // Act
      const result = await controller.findAll(req);

      // Assert
      expect(result).toEqual(mockReservations);
      expect(service.findAll).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('create', () => {
    it('should create a new reservation', async () => {
      // Arrange
      const createReservationDto: CreateReservationDto = {
        movieId: 123,
        time: '2024-04-15T19:30:00Z',
      };
      const req = { user: mockUser };

      // Act
      const result = await controller.create(createReservationDto, req);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.movieId).toBe(createReservationDto.movieId);
      expect(result.reservationDate).toBe(createReservationDto.time);
      expect(service.create).toHaveBeenCalledWith(
        mockUser.sub,
        createReservationDto.time,
        createReservationDto.movieId,
      );
    });
  });

  describe('deleteById', () => {
    it('should delete a reservation by ID', async () => {
      // Arrange
      const req = { user: mockUser };
      const id = 1;

      // Act
      await controller.deleteById(req, id);

      // Assert
      expect(service.deleteById).toHaveBeenCalledWith(mockUser.sub, id);
    });
  });
});
