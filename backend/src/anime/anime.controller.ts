import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AnimeService } from './anime.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnimeSearchParams } from './providers/base.provider';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get()
  findAll(
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('genres') genres?: string,
    @Query('year') year?: string,
    @Query('season') season?: string,
    @Query('status') status?: string,
  ) {
    const params: AnimeSearchParams = {
      query,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      genres: genres ? genres.split(',') : undefined,
      year: year ? parseInt(year, 10) : undefined,
      season,
      status,
    };
    return this.animeService.findAll(params);
  }

  @Get('popular')
  findPopular() {
    return this.animeService.findPopular();
  }

  @Get('ongoing')
  findOngoing() {
    return this.animeService.findOngoing();
  }

  @Get('upcoming')
  findUpcoming() {
    return this.animeService.findUpcoming();
  }

  @Get('seasonal')
  findSeasonal(
    @Query('year') year: string,
    @Query('season') season: string,
  ) {
    return this.animeService.findSeasonal(parseInt(year), season);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/favorites')
  addToFavorites(@Request() req, @Param('id') animeId: string) {
    return this.animeService.addToFavorites(req.user.id, animeId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorites')
  removeFromFavorites(@Request() req, @Param('id') animeId: string) {
    return this.animeService.removeFromFavorites(req.user.id, animeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/favorites')
  getFavorites(@Request() req) {
    return this.animeService.getFavorites(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/progress')
  updateWatchProgress(
    @Request() req,
    @Param('id') animeId: string,
    @Body() data: { episode: number; progress: number },
  ) {
    return this.animeService.updateWatchProgress(
      req.user.id,
      animeId,
      data.episode,
      data.progress,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/history')
  getWatchHistory(@Request() req) {
    return this.animeService.getWatchHistory(req.user.id);
  }
}