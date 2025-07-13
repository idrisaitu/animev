import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class KodikService {
  private readonly baseUrl = 'https://kodikapi.com';
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('KODIK_API_KEY');
  }

  async findVideo(animeTitle: string, episode: number) {
    try {
      if (!this.apiKey) {
        console.warn('Kodik API key not configured');
        return null;
      }

      // Search for anime by title
      const searchResponse = await axios.get(`${this.baseUrl}/search`, {
        params: {
          token: this.apiKey,
          title: animeTitle,
          types: 'anime-serial,anime',
          limit: 10,
        },
      });

      if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
        return null;
      }

      // Find the anime with matching title
      const anime = searchResponse.data.results.find(result =>
        result.title.toLowerCase().includes(animeTitle.toLowerCase()) ||
        result.title_orig?.toLowerCase().includes(animeTitle.toLowerCase())
      );

      if (!anime) {
        return null;
      }

      // Get episodes for this anime
      const episodesResponse = await axios.get(`${this.baseUrl}/list`, {
        params: {
          token: this.apiKey,
          shikimori_id: anime.shikimori_id,
          episode: episode,
          limit: 1,
        },
      });

      if (!episodesResponse.data.results || episodesResponse.data.results.length === 0) {
        return null;
      }

      const episodeData = episodesResponse.data.results[0];

      return {
        url: episodeData.link,
        quality: episodeData.quality || '720p',
        title: episodeData.title,
        episode: episodeData.episode,
      };
    } catch (error) {
      console.error('Error fetching video from Kodik:', error);
      return null;
    }
  }

  async searchAnime(title: string) {
    try {
      if (!this.apiKey) {
        return [];
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          token: this.apiKey,
          title: title,
          types: 'anime-serial,anime',
          limit: 20,
        },
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Error searching anime on Kodik:', error);
      return [];
    }
  }
}