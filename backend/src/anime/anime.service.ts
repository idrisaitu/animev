import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnimeProviderService } from './providers/anime-provider.service';
import { Anime } from '@prisma/client';
import { AnimeSearchParams } from './providers/base.provider';

@Injectable()
export class AnimeService {
  constructor(
    private prisma: PrismaService,
    private providerService: AnimeProviderService,
  ) {}

  async findAll(params: AnimeSearchParams) {
    const { query, page = 1, limit = 20 } = params;

    // Ensure page and limit are numbers
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;

    // If no query, return local database content
    if (!query) {
      const [anime, total] = await this.prisma.$transaction([
        this.prisma.anime.findMany({
          include: {
            genres: true,
          },
          orderBy: {
            rating: 'desc',
          },
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
        }),
        this.prisma.anime.count(),
      ]);

      return {
        items: anime,
        total,
        hasNextPage: total > pageNum * limitNum,
      };
    }

    // Hybrid Search: Combine local and external results
    const [localResults, externalResults] = await Promise.all([
      this.prisma.anime.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { originalTitle: { contains: query } },
          ],
        },
        include: {
          genres: true,
        },
        take: limitNum,
      }),
      this.providerService.search(params),
    ]);

    // Combine and deduplicate results
    const combinedResults = [...localResults, ...(externalResults.items || [])];
    const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.id, item])).values());

    return {
      items: uniqueResults.slice(0, limitNum),
      total: uniqueResults.length,
      hasNextPage: externalResults.hasNextPage || uniqueResults.length > limitNum,
    };
  }

  async findOne(id: string) {
    // First check local database
    const localAnime = await this.prisma.anime.findUnique({
      where: { id },
      include: {
        genres: true,
      },
    });

    if (localAnime) {
      return localAnime;
    }

    // If not found locally, try external providers
    return this.providerService.getAnimeDetails(id);
  }

  async findPopular() {
    // Get popular anime from local database first
    const localPopular = await this.prisma.anime.findMany({
      include: {
        genres: true,
      },
      orderBy: {
        rating: 'desc',
      },
      take: 20,
    });

    if (localPopular.length > 0) {
      return {
        items: localPopular,
        total: localPopular.length,
        hasNextPage: false,
      };
    }

    return this.providerService.getPopularAnime();
  }

  async findOngoing() {
    return this.providerService.getOngoingAnime();
  }

  async findUpcoming() {
    return this.providerService.getUpcomingAnime();
  }

  async findSeasonal(year: number, season: string) {
    return this.providerService.getSeasonalAnime(year, season);
  }

  async addToFavorites(userId: string, animeId: string) {
    return this.prisma.favorite.create({
      data: {
        userId,
        animeId,
      },
      include: {
        anime: {
          include: {
            genres: true,
          },
        },
      },
    });
  }

  async removeFromFavorites(userId: string, animeId: string) {
    return this.prisma.favorite.delete({
      where: {
        userId_animeId: {
          userId,
          animeId,
        },
      },
    });
  }

  async getFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        anime: {
          include: {
            genres: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      items: favorites.map(f => ({
        ...f.anime,
        isFavorite: true,
      })),
      total: favorites.length,
      hasNextPage: false,
    };
  }

  async updateWatchProgress(userId: string, animeId: string, episode: number, progress: number) {
    return this.prisma.watchHistory.upsert({
      where: {
        userId_animeId_episode: {
          userId,
          animeId,
          episode,
        },
      },
      update: {
        progress,
      },
      create: {
        userId,
        animeId,
        episode,
        progress,
      },
    });
  }

  async getWatchHistory(userId: string) {
    const history = await this.prisma.watchHistory.findMany({
      where: { userId },
      distinct: ['animeId'],
      include: {
        anime: {
          include: {
            genres: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return {
      items: history.map(h => h.anime),
      total: history.length,
      hasNextPage: false,
    };
  }
} 