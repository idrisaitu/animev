import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnimeProvider, AnimeSearchParams, AnimeSearchResult } from './base.provider';
import { MyAnimeListProvider } from './mal.provider';
import { Anime } from '@prisma/client';

@Injectable()
export class AnimeProviderService {
  private providers: AnimeProvider[] = [];

  constructor(
    private prisma: PrismaService,
    private malProvider: MyAnimeListProvider,
  ) {
    this.providers.push(malProvider);
  }

  async search(params: AnimeSearchParams): Promise<AnimeSearchResult> {
    // Search in all providers and merge results
    const results = await Promise.all(
      this.providers.map(provider => provider.search(params))
    );

    // Merge and deduplicate results
    const mergedItems = await this.mergeAndSyncResults(
      results.flatMap(result => result.items)
    );

    return {
      items: mergedItems,
      total: Math.max(...results.map(r => r.total)),
      hasNextPage: results.some(r => r.hasNextPage),
    };
  }

  async getAnimeDetails(id: string): Promise<Anime> {
    // First check our database
    const existingAnime = await this.prisma.anime.findUnique({
      where: { id },
      include: { genres: true },
    });

    if (existingAnime) {
      // Check if we need to update the data (e.g., if it's older than 24 hours)
      const isStale = this.isDataStale(existingAnime.updatedAt);
      if (!isStale) return existingAnime;
    }

    // If not found or stale, fetch from providers
    for (const provider of this.providers) {
      const animeData = await provider.getAnimeDetails(id);
      if (animeData) {
        return this.syncAnimeToDatabase(animeData);
      }
    }

    return existingAnime;
  }

  async getSeasonalAnime(year: number, season: string): Promise<AnimeSearchResult> {
    const results = await Promise.all(
      this.providers.map(provider => provider.getSeasonalAnime(year, season))
    );

    const mergedItems = await this.mergeAndSyncResults(
      results.flatMap(result => result.items)
    );

    return {
      items: mergedItems,
      total: Math.max(...results.map(r => r.total)),
      hasNextPage: results.some(r => r.hasNextPage),
    };
  }

  async getOngoingAnime(): Promise<AnimeSearchResult> {
    const results = await Promise.all(
      this.providers.map(provider => provider.getOngoingAnime())
    );

    const mergedItems = await this.mergeAndSyncResults(
      results.flatMap(result => result.items)
    );

    return {
      items: mergedItems,
      total: Math.max(...results.map(r => r.total)),
      hasNextPage: results.some(r => r.hasNextPage),
    };
  }

  async getUpcomingAnime(): Promise<AnimeSearchResult> {
    const results = await Promise.all(
      this.providers.map(provider => provider.getUpcomingAnime())
    );

    const mergedItems = await this.mergeAndSyncResults(
      results.flatMap(result => result.items)
    );

    return {
      items: mergedItems,
      total: Math.max(...results.map(r => r.total)),
      hasNextPage: results.some(r => r.hasNextPage),
    };
  }

  async getPopularAnime(): Promise<AnimeSearchResult> {
    const results = await Promise.all(
      this.providers.map(provider => provider.getPopularAnime())
    );

    const mergedItems = await this.mergeAndSyncResults(
      results.flatMap(result => result.items)
    );

    return {
      items: mergedItems,
      total: Math.max(...results.map(r => r.total)),
      hasNextPage: results.some(r => r.hasNextPage),
    };
  }

  private async mergeAndSyncResults(items: Partial<Anime>[]): Promise<Anime[]> {
    // Deduplicate by title
    const uniqueItems = items.filter((item, index, self) =>
      index === self.findIndex(t => t.title === item.title)
    );

    // Sync each item with the database
    return Promise.all(uniqueItems.map(item => this.syncAnimeToDatabase(item)));
  }

  private async syncAnimeToDatabase(animeData: Partial<Anime> & { genres?: string[] }): Promise<Anime> {
    const { genres: genreNames, ...animeFields } = animeData;

    // Create or connect genres
    const genres = genreNames ? {
      connectOrCreate: genreNames.map(name => ({
        where: { name },
        create: { name },
      })),
    } : undefined;

    // Update or create anime
    return this.prisma.anime.upsert({
      where: {
        malId: animeData.malId,
      },
      update: {
        ...animeFields,
        ...(genres && { genres }),
        updatedAt: new Date(),
      },
      create: {
        ...animeFields,
        title: animeData.title || 'Unknown Title',
        type: animeData.type || 'UNKNOWN',
        status: animeData.status || 'UNKNOWN',
        ...(genres && { genres }),
      },
      include: {
        genres: true,
      },
    });
  }

  private isDataStale(updatedAt: Date): boolean {
    const staleThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return Date.now() - updatedAt.getTime() > staleThreshold;
  }
} 