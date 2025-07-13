import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import axios from 'axios';
import { SourceManager } from './source.manager';

export interface StreamingSource {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export interface AnimeEpisode {
  id: string;
  number: number;
  title?: string;
  image?: string;
  description?: string;
}

export interface AnimeInfo {
  id: string;
  title: string;
  image: string;
  description?: string;
  genres?: string[];
  releaseDate?: string;
  status?: string;
  totalEpisodes?: number;
  episodes: AnimeEpisode[];
}

@Injectable()
@UseInterceptors(CacheInterceptor)
export class StreamingService {
  private readonly logger = new Logger(StreamingService.name);
  private readonly CONSUMET_BASE_URL = 'https://api.consumet.org';

  constructor(private readonly sourceManager: SourceManager) {}

  private async trySources<T>(
    path: string,
    preferredSource: string,
    params: Record<string, any> = {},
    timeout: number = 10000,
  ): Promise<T> {
    const sources = this.sourceManager.getSources(preferredSource);

    for (const src of sources) {
      try {
        const response = await axios.get(
          `${this.CONSUMET_BASE_URL}/anime/${src}/${path}`,
          { params, timeout },
        );

        if (response.data && (response.data.results || response.data.id || response.data.sources)) {
          return { ...response.data, source: src } as T;
        }
      } catch (error) {
        this.logger.warn(`Request to source [${src}] failed for path [${path}]`);
        this.sourceManager.reportFailure(src);
        continue;
      }
    }

    throw new HttpException(
      `Failed to fetch data for path [${path}] from all available sources.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @CacheTTL(600) // 10 minutes
  async searchAnime(query: string, page: number = 1, source: string = 'gogoanime'): Promise<any> {
    return this.trySources(`search/${encodeURIComponent(query)}`, source, { page });
  }

  @CacheTTL(600) // 10 minutes
  async getAnimeInfo(animeId: string, source: string = 'gogoanime'): Promise<AnimeInfo> {
    const data = await this.trySources<any>(`info/${animeId}`, source, {}, 15000);
    return {
      id: data.id,
      title: data.title,
      image: data.image,
      description: data.description,
      genres: data.genres,
      releaseDate: data.releaseDate,
      status: data.status,
      totalEpisodes: data.totalEpisodes,
      episodes: data.episodes || [],
    };
  }

  @CacheTTL(3600) // 1 hour
  async getEpisodeStreamingLinks(episodeId: string, source: string = 'gogoanime'): Promise<StreamingSource[]> {
    const data = await this.trySources<any>(`watch/${episodeId}`, source, {}, 15000);
    const streamingSources = data.sources || data.primary || [];
    return streamingSources.map((s: any) => ({
      url: s.url,
      quality: s.quality || 'default',
      isM3U8: s.isM3U8 || false,
    }));
  }

  @CacheTTL(600) // 10 minutes
  async getRecentEpisodes(page: number = 1, source: string = 'gogoanime'): Promise<any> {
    return this.trySources('recent-episodes', source, { page });
  }

  @CacheTTL(600) // 10 minutes
  async getTopAiring(page: number = 1, source: string = 'gogoanime'): Promise<any> {
    return this.trySources('top-airing', source, { page });
  }

  @CacheTTL(600) // 10 minutes
  async getPopularAnime(page: number = 1, source: string = 'gogoanime'): Promise<any> {
    return this.trySources('popular', source, { page });
  }

  @CacheTTL(600) // 10 minutes
  async searchByGenre(genre: string, page: number = 1, source: string = 'gogoanime'): Promise<any> {
    return this.trySources(`genre/${encodeURIComponent(genre)}`, source, { page });
  }

  @CacheTTL(86400) // 24 hours
  async getAnimeGenres(source: string = 'gogoanime'): Promise<any> {
    try {
      return await this.trySources(`genre/list`, source);
    } catch (error) {
      this.logger.error('Failed to fetch genres from any source, returning fallback list.');
      return {
        genres: [
          'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
          'Horror', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports',
          'Supernatural', 'Thriller', 'Mystery', 'Historical',
        ],
      };
    }
  }

  getAvailableSources(): string[] {
    return this.sourceManager.getSources();
  }
}
