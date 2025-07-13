import { Anime } from '@prisma/client';

export interface AnimeSearchParams {
  query?: string;
  page?: number;
  limit?: number;
  genres?: string[];
  year?: number;
  season?: string;
  status?: string;
}

export interface AnimeSearchResult {
  items: Partial<Anime>[];
  total: number;
  hasNextPage: boolean;
}

export interface AnimeProvider {
  name: string;
  
  // Search for anime
  search(params: AnimeSearchParams): Promise<AnimeSearchResult>;
  
  // Get detailed information about a specific anime
  getAnimeDetails(id: string): Promise<Partial<Anime>>;
  
  // Get seasonal anime
  getSeasonalAnime(year: number, season: string): Promise<AnimeSearchResult>;
  
  // Get currently airing anime
  getOngoingAnime(): Promise<AnimeSearchResult>;
  
  // Get upcoming anime
  getUpcomingAnime(): Promise<AnimeSearchResult>;
  
  // Get popular anime
  getPopularAnime(): Promise<AnimeSearchResult>;
  
  // Map provider-specific data to our Anime model
  mapToAnime(data: any): Partial<Anime>;
} 