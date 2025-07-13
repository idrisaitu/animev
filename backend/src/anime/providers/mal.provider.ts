import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Anime } from '@prisma/client';
import { AnimeProvider, AnimeSearchParams, AnimeSearchResult } from './base.provider';

@Injectable()
export class MyAnimeListProvider implements AnimeProvider {
  name = 'myanimelist';
  private readonly apiClient;

  constructor(private configService: ConfigService) {
    this.apiClient = axios.create({
      baseURL: 'https://api.myanimelist.net/v2',
      headers: {
        'X-MAL-CLIENT-ID': this.configService.get('MAL_CLIENT_ID'),
      },
    });
  }

  private readonly fields = [
    'id',
    'title',
    'main_picture',
    'alternative_titles',
    'start_date',
    'end_date',
    'synopsis',
    'mean',
    'rank',
    'popularity',
    'num_episodes',
    'status',
    'genres',
    'media_type',
    'rating',
    'studios',
    'source',
    'average_episode_duration',
  ].join(',');

  async search(params: AnimeSearchParams): Promise<AnimeSearchResult> {
    try {
      const response = await this.apiClient.get('/anime', {
        params: {
          q: params.query,
          limit: params.limit || 20,
          offset: ((params.page || 1) - 1) * (params.limit || 20),
          fields: this.fields,
        },
      });

      return {
        items: response.data.data.map(item => this.mapToAnime(item.node)),
        total: response.data.paging.total || 0,
        hasNextPage: !!response.data.paging.next,
      };
    } catch (error) {
      console.error('MyAnimeList search error:', error);
      return { items: [], total: 0, hasNextPage: false };
    }
  }

  async getAnimeDetails(id: string): Promise<Partial<Anime>> {
    try {
      const response = await this.apiClient.get(`/anime/${id}`, {
        params: { fields: this.fields },
      });

      return this.mapToAnime(response.data);
    } catch (error) {
      console.error('MyAnimeList getAnimeDetails error:', error);
      return null;
    }
  }

  async getSeasonalAnime(year: number, season: string): Promise<AnimeSearchResult> {
    try {
      const response = await this.apiClient.get(`/anime/season/${year}/${season}`, {
        params: {
          limit: 20,
          fields: this.fields,
        },
      });

      return {
        items: response.data.data.map(item => this.mapToAnime(item.node)),
        total: response.data.paging.total || 0,
        hasNextPage: !!response.data.paging.next,
      };
    } catch (error) {
      console.error('MyAnimeList getSeasonalAnime error:', error);
      return { items: [], total: 0, hasNextPage: false };
    }
  }

  async getOngoingAnime(): Promise<AnimeSearchResult> {
    try {
      const response = await this.apiClient.get('/anime/ranking', {
        params: {
          ranking_type: 'airing',
          limit: 20,
          fields: this.fields,
        },
      });

      return {
        items: response.data.data.map(item => this.mapToAnime(item.node)),
        total: response.data.paging.total || 0,
        hasNextPage: !!response.data.paging.next,
      };
    } catch (error) {
      console.error('MyAnimeList getOngoingAnime error:', error);
      return { items: [], total: 0, hasNextPage: false };
    }
  }

  async getUpcomingAnime(): Promise<AnimeSearchResult> {
    try {
      const response = await this.apiClient.get('/anime/ranking', {
        params: {
          ranking_type: 'upcoming',
          limit: 20,
          fields: this.fields,
        },
      });

      return {
        items: response.data.data.map(item => this.mapToAnime(item.node)),
        total: response.data.paging.total || 0,
        hasNextPage: !!response.data.paging.next,
      };
    } catch (error) {
      console.error('MyAnimeList getUpcomingAnime error:', error);
      return { items: [], total: 0, hasNextPage: false };
    }
  }

  async getPopularAnime(): Promise<AnimeSearchResult> {
    try {
      const response = await this.apiClient.get('/anime/ranking', {
        params: {
          ranking_type: 'bypopularity',
          limit: 20,
          fields: this.fields,
        },
      });

      return {
        items: response.data.data.map(item => this.mapToAnime(item.node)),
        total: response.data.paging.total || 0,
        hasNextPage: !!response.data.paging.next,
      };
    } catch (error) {
      console.error('MyAnimeList getPopularAnime error:', error);
      return { items: [], total: 0, hasNextPage: false };
    }
  }

  mapToAnime(data: any): Partial<Anime> {
    return {
      malId: data.id.toString(),
      title: data.title,
      originalTitle: data.alternative_titles?.ja,
      description: data.synopsis,
      image: data.main_picture?.large || data.main_picture?.medium,
      type: this.mapMediaType(data.media_type),
      episodes: data.num_episodes,
      status: this.mapStatus(data.status),
      releaseDate: data.start_date ? new Date(data.start_date) : null,
      rating: data.mean || 0,
      duration: data.average_episode_duration || 0,
    };
  }

  private mapMediaType(type: string) {
    const typeMap = {
      tv: 'TV',
      movie: 'MOVIE',
      ova: 'OVA',
      ona: 'ONA',
      special: 'SPECIAL',
    };
    return typeMap[type?.toLowerCase()] || 'TV';
  }

  private mapStatus(status: string) {
    const statusMap = {
      currently_airing: 'ONGOING',
      finished_airing: 'FINISHED',
      not_yet_aired: 'ANNOUNCED',
    };
    return statusMap[status] || 'FINISHED';
  }
} 