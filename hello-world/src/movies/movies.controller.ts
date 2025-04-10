import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService, MovieResponse } from './movies.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
enum SearchBy {
  ORIGINAL_TITLE_ASC = 'original_title.asc',
  ORIGINAL_TITLE_DESC = 'original_title.desc',
  POPULARITY_ASC = 'popularity.asc',
  POPULARITY_DESC = 'popularity.desc',
  REVENUE_ASC = 'revenue.asc',
  REVENUE_DESC = 'revenue.desc',
  PRIMARY_RELEASE_DATE_ASC = 'primary release_date.asc',
  TITLE_ASC = 'title.asc',
  TITLE_DESC = 'title.desc',
  PRIMARY_RELEASE_DATE_DESC = 'primary_release_date.desc',
  VOTE_AVERAGE_ASC = 'vote average.asc',
  VOTE_AVERAGE_DESC = 'vote_average.desc',
  VOTE_COUNT_ASC = 'vote_count.asc',
  VOTE_COUNT_DESC = 'vote_count.desc',
}

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Request all films with filters' })
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'Page de recherche',
    default: 1,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Page dans les titre de film',
    default: '',
  })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    description: 'Trier les films',
    default: 1,
    enum: SearchBy,
  })
  @ApiResponse({
    status: 200,
    description: 'List of movies matching criteria',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('search') search: string,
    @Query('sort_by') sort_by: string,
  ): Promise<{ results: MovieResponse }> {
    return await this.moviesService.findAllWithFilters(+page, search, sort_by);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Request film by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Movie ID',
  })
  @ApiResponse({ status: 200, description: 'Movie details found' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async findOne(@Param('id') id: number) {
    return await this.moviesService.findOne(id);
  }
}
