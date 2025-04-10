/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService, MovieResponse, Movie } from './movies.service';
import { BadRequestException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  // Mock des données
  const mockMovie: Movie = {
    id: 123,
    title: 'Test Movie',
    overview: 'This is a test movie',
    release_date: '2024-04-15',
    poster_path: '/path/to/poster.jpg',
    backdrop_path: '/path/to/backdrop.jpg',
    popularity: 8.5,
    vote_average: 7.8,
    vote_count: 1000,
    adult: false,
    genre_ids: [28, 12],
    original_language: 'en',
    original_title: 'Test Movie Original',
    video: false,
  };

  const mockMovieResponse: MovieResponse = {
    page: 1,
    results: [mockMovie],
    total_pages: 10,
    total_results: 100,
  };

  // Mock du service
  const mockMoviesService = {
    findAllWithFilters: jest
      .fn()
      .mockImplementation((page, search, sort_by) => {
        // Simuler le comportement du service
        if (sort_by && search) {
          throw new BadRequestException(
            'Pas possible mon reuf de filtrer et rechercher',
          );
        }
        return Promise.resolve({ results: mockMovieResponse });
      }),
    findOne: jest.fn().mockImplementation(() => {
      return Promise.resolve({ results: mockMovie });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return movies when only page is provided', async () => {
      // Arrange
      const page = 1;

      // Act
      const result = await controller.findAll(page, '', '');

      // Assert
      expect(result).toEqual({ results: mockMovieResponse });
      expect(service.findAllWithFilters).toHaveBeenCalledWith(page, '', '');
    });

    it('should return movies when search is provided', async () => {
      // Arrange
      const page = 1;
      const search = 'test';

      // Act
      const result = await controller.findAll(page, search, '');

      // Assert
      expect(result).toEqual({ results: mockMovieResponse });
      expect(service.findAllWithFilters).toHaveBeenCalledWith(page, search, '');
    });

    it('should return movies when sort_by is provided', async () => {
      // Arrange
      const page = 1;
      const sort_by = 'popularity.desc';

      // Act
      const result = await controller.findAll(page, '', sort_by);

      // Assert
      expect(result).toEqual({ results: mockMovieResponse });
      expect(service.findAllWithFilters).toHaveBeenCalledWith(
        page,
        '',
        sort_by,
      );
    });

    it('should throw BadRequestException when both search and sort_by are provided', async () => {
      // Arrange
      const page = 1;
      const search = 'test';
      const sort_by = 'popularity.desc';

      // Act & Assert
      await expect(controller.findAll(page, search, sort_by)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.findAllWithFilters).toHaveBeenCalledWith(
        page,
        search,
        sort_by,
      );
    });

    it('should use default page value when not provided', async () => {
      // Act
      const result = await controller.findAll(undefined, '', '');

      // Assert
      expect(result).toEqual({ results: mockMovieResponse });
      expect(service.findAllWithFilters).toHaveBeenCalledWith(1, '', '');
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      // Arrange
      const id = 123;

      // Act
      const result = await controller.findOne(id);

      // Assert
      expect(result).toEqual({ results: mockMovie });
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });
});
