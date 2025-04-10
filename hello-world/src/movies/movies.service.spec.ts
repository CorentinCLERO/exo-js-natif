/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService, MovieResponse, Movie } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;

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

  // Mock de la réponse HTTP
  const mockHttpResponse: AxiosResponse = {
    data: { results: mockMovieResponse },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} } as any,
  };

  const mockSingleMovieResponse: AxiosResponse = {
    data: { results: mockMovie },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} } as any,
  };

  // Mock du HttpService
  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);

    // Configuration de l'environnement
    process.env.MOVIE_TOKEN = 'test-token';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllWithFilters', () => {
    it('should return now playing movies when no filters are provided', async () => {
      // Arrange
      mockHttpService.get.mockReturnValue(of(mockHttpResponse));

      // Act
      const result = await service.findAllWithFilters(1, null, null);

      // Assert
      expect(result).toEqual({ results: mockMovieResponse });
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/now_playing',
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
          params: { page: 1, query: null, sort_by: null },
        }),
      );
    });

    it('should use search endpoint when search parameter is provided', async () => {
      // Arrange
      mockHttpService.get.mockReturnValue(of(mockHttpResponse));

      // Act
      const result = await service.findAllWithFilters(1, 'test', null);

      // Assert
      expect(result).toEqual({ results: mockMovieResponse });
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/search/movie',
        expect.objectContaining({
          params: { page: 1, query: 'test', sort_by: null },
        }),
      );
    });

    it('should use discover endpoint when sort_by parameter is provided', async () => {
      // Arrange
      mockHttpService.get.mockReturnValue(of(mockHttpResponse));

      // Act
      const result = await service.findAllWithFilters(
        1,
        null,
        'popularity.desc',
      );

      // Assert
      expect(result).toEqual({ results: mockMovieResponse });
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/discover/movie',
        expect.objectContaining({
          params: { page: 1, query: null, sort_by: 'popularity.desc' },
        }),
      );
    });

    it('should throw BadRequestException when both search and sort_by are provided', async () => {
      // Act & Assert
      await expect(
        service.findAllWithFilters(1, 'test', 'popularity.desc'),
      ).rejects.toThrow(BadRequestException);
      expect(httpService.get).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      // Arrange
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      // Act & Assert
      await expect(service.findAllWithFilters(1, null, null)).rejects.toThrow(
        'An error happened!',
      );
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      // Arrange
      mockHttpService.get.mockReturnValue(of(mockSingleMovieResponse));

      // Act
      const result = await service.findOne(123);

      // Assert
      expect(result).toEqual({ results: mockMovie });
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/123',
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
        }),
      );
    });

    it('should handle API errors', async () => {
      // Arrange
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      // Act & Assert
      await expect(service.findOne(123)).rejects.toThrow('An error happened!');
    });
  });
});
