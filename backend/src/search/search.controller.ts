import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('q') query?: string,
    @Query('genres') genres?: string,
    @Query('year') year?: string,
    @Query('season') season?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('rating') rating?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      query,
      genres: genres ? genres.split(',') : undefined,
      year: year ? parseInt(year) : undefined,
      season,
      status,
      type,
      rating: rating ? parseFloat(rating) : undefined,
      sort: sort as any,
      order: order as any,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    };

    return this.searchService.searchAnime(filters);
  }

  @Get('filters')
  async getFilters() {
    return this.searchService.getFilters();
  }

  @Get('genres')
  async getGenres() {
    return this.searchService.getGenres();
  }

  @Get('genres/popular')
  async getPopularGenres() {
    return this.searchService.getPopularGenres();
  }

  @Get('years')
  async getYears() {
    return this.searchService.getYears();
  }
}
