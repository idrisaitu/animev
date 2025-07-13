import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { KodikService } from './providers/kodik.service';
import { SibnetService } from './providers/sibnet.service';

@Injectable()
export class VideosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kodikService: KodikService,
    private readonly sibnetService: SibnetService,
  ) {}

  async findVideosByAnimeId(animeId: string) {
    return this.prisma.video.findMany({
      where: { animeId },
      orderBy: { episode: 'asc' },
    });
  }

  async getVideoSources(animeId: string, episode: number) {
    const videos = await this.prisma.video.findMany({
      where: {
        animeId,
        episode,
      },
    });

    if (videos.length === 0) {
      // Get anime details to use title for searching
      const anime = await this.prisma.anime.findUnique({
        where: { id: animeId },
      });

      if (!anime) {
        return [];
      }

      const [kodikVideo, sibnetVideo] = await Promise.all([
        this.kodikService.findVideo(anime.title, episode),
        this.sibnetService.findVideo(anime.title, episode),
      ]);

      const newVideos = [];

      if (kodikVideo) {
        const video = await this.prisma.video.create({
          data: {
            animeId,
            episode,
            source: 'KODIK',
            url: kodikVideo.url,
            quality: kodikVideo.quality,
          },
        });
        newVideos.push(video);
      }

      if (sibnetVideo) {
        const video = await this.prisma.video.create({
          data: {
            animeId,
            episode,
            source: 'SIBNET',
            url: sibnetVideo.url,
            quality: sibnetVideo.quality,
          },
        });
        newVideos.push(video);
      }

      return newVideos;
    }

    return videos;
  }

  async refreshVideoSources(animeId: string, episode: number) {
    await this.prisma.video.deleteMany({
      where: {
        animeId,
        episode,
      },
    });

    return this.getVideoSources(animeId, episode);
  }
} 