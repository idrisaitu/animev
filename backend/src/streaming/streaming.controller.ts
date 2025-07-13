import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Get('search')
  async searchAnime(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('source') source: string = 'gogoanime',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    return this.streamingService.searchAnime(query, pageNum, source);
  }

  @Get('info/:animeId')
  async getAnimeInfo(
    @Param('animeId') animeId: string,
    @Query('source') source: string = 'gogoanime',
  ) {
    return this.streamingService.getAnimeInfo(animeId, source);
  }

  @Get('watch/:episodeId')
  async getStreamingLinks(
    @Param('episodeId') episodeId: string,
    @Query('source') source: string = 'gogoanime',
    @Query('multiple') multiple: string = 'false',
  ) {
    const sources = await this.streamingService.getEpisodeStreamingLinks(episodeId, source);

    if (multiple === 'true') {
      return {
        primary: sources,
        backup: [] // Можно добавить резервные источники
      };
    }

    return { sources };
  }

  @Get('recent')
  async getRecentEpisodes(
    @Query('page') page: string = '1',
    @Query('source') source: string = 'gogoanime'
  ) {
    const pageNum = parseInt(page, 10) || 1;
    return this.streamingService.getRecentEpisodes(pageNum, source);
  }

  @Get('top-airing')
  async getTopAiring(
    @Query('page') page: string = '1',
    @Query('source') source: string = 'gogoanime'
  ) {
    const pageNum = parseInt(page, 10) || 1;
    return this.streamingService.getTopAiring(pageNum, source);
  }

  @Get('popular')
  async getPopular(
    @Query('page') page: string = '1',
    @Query('source') source: string = 'gogoanime'
  ) {
    const pageNum = parseInt(page, 10) || 1;
    return this.streamingService.getPopularAnime(pageNum, source);
  }

  @Get('genres')
  async getGenres(@Query('source') source: string = 'gogoanime') {
    return this.streamingService.getAnimeGenres(source);
  }

  @Get('genre/:genre')
  async searchByGenre(
    @Param('genre') genre: string,
    @Query('page') page: string = '1',
    @Query('source') source: string = 'gogoanime'
  ) {
    const pageNum = parseInt(page, 10) || 1;
    return this.streamingService.searchByGenre(genre, pageNum, source);
  }

  @Get('sources')
  async getAvailableSources() {
    return {
      sources: this.streamingService.getAvailableSources(),
      default: 'gogoanime'
    };
  }

  // Защищенные маршруты для отслеживания прогресса
  @UseGuards(JwtAuthGuard)
  @Get('progress/:animeId')
  async getWatchProgress(
    @Param('animeId') animeId: string,
    @Request() req: any,
  ) {
    // TODO: Реализовать получение прогресса просмотра
    return {
      animeId,
      userId: req.user.id,
      currentEpisode: 1,
      watchTime: 0,
      totalTime: 0,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('continue-watching')
  async getContinueWatching(@Request() req: any) {
    // TODO: Реализовать получение списка "Продолжить просмотр"
    return {
      userId: req.user.id,
      continueWatching: [],
    };
  }
}
