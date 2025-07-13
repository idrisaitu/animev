import { Controller, Get, Post, Param, UseGuards, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('anime/:animeId')
  @UseGuards(JwtAuthGuard)
  async findVideosByAnimeId(@Param('animeId') animeId: string) {
    return this.videosService.findVideosByAnimeId(animeId);
  }

  @Get('anime/:animeId/episode/:episode')
  @UseGuards(JwtAuthGuard)
  async getVideoSources(
    @Param('animeId') animeId: string,
    @Param('episode') episode: number,
  ) {
    return this.videosService.getVideoSources(animeId, episode);
  }

  @Post('anime/:animeId/episode/:episode/refresh')
  @UseGuards(JwtAuthGuard)
  async refreshVideoSources(
    @Param('animeId') animeId: string,
    @Param('episode') episode: number,
  ) {
    return this.videosService.refreshVideoSources(animeId, episode);
  }
} 