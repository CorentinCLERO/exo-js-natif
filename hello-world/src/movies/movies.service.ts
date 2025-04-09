import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

@Injectable()
export class MoviesService {
  private url: string;
  constructor(private readonly httpService: HttpService) {}

  async findAllWithFilters(
    page: number,
    search: string | null,
    sort_by: string | null,
  ): Promise<{ results: MovieResponse }> {
    if (sort_by && search) {
      console.log('sort_by', sort_by, 'search', search);
      throw new BadRequestException(
        'Pas possible mon reuf de filtrer et rechercher',
      );
    } else if (search) {
      console.log('search', search);
      this.url = 'https://api.themoviedb.org/3/search/movie';
    } else if (sort_by) {
      console.log('sort_by', sort_by);
      this.url = 'https://api.themoviedb.org/3/discover/movie';
    } else {
      this.url = 'https://api.themoviedb.org/3/movie/now_playing';
    }
    // https://docs.nestjs.com/techniques/http-module#full-example
    const response = await firstValueFrom(
      this.httpService
        .get<{ results: MovieResponse }>(this.url, {
          headers: { Authorization: `Bearer ${process.env.MOVIE_TOKEN}` },
          params: { page, query: search, sort_by },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error?.response?.data);
            throw new Error('An error happened!');
          }),
        ),
    );
    const data = response.data;
    return data;
  }

  async findOne(id: number): Promise<{ results: Movie }> {
    const response = await firstValueFrom(
      this.httpService
        .get<{ results: Movie }>(`https://api.themoviedb.org/3/movie/${id}`, {
          headers: { Authorization: `Bearer ${process.env.MOVIE_TOKEN}` },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error?.response?.data);
            throw new Error('An error happened!');
          }),
        ),
    );
    const data = response.data;
    return data;
  }
}
