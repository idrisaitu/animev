import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AnimeService } from '../anime/anime.service';

interface SearchFilters {
  query?: string;
  genres?: string[];
  year?: number;
  season?: string;
  status?: string;
  type?: string;
  rating?: number;
  sort?: 'title' | 'rating' | 'year' | 'popularity' | 'episodes';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly animeService: AnimeService,
  ) {}

  async searchAnime(filters: SearchFilters) {
    const {
      query,
      genres,
      year,
      season,
      status,
      type,
      rating,
      sort = 'rating',
      order = 'desc',
      page = 1,
      limit = 20,
    } = filters;

    // If there's a query, search external providers first
    if (query) {
      const externalResults = await this.animeService.findAll({
        query,
        page,
        limit,
      });

      // Filter external results based on additional filters
      let filteredResults = externalResults.items;

      if (genres && genres.length > 0) {
        filteredResults = filteredResults.filter(anime =>
          (anime as any).genres?.some(genre => genres.includes(genre))
        );
      }

      if (year) {
        filteredResults = filteredResults.filter(anime => (anime as any).year === year);
      }

      if (status) {
        filteredResults = filteredResults.filter(anime => anime.status === status);
      }

      if (type) {
        filteredResults = filteredResults.filter(anime => anime.type === type);
      }

      if (rating) {
        filteredResults = filteredResults.filter(anime => anime.rating >= rating);
      }

      // Sort results
      filteredResults.sort((a, b) => {
        let aValue, bValue;
        switch (sort) {
          case 'title':
            aValue = a.title;
            bValue = b.title;
            break;
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case 'year':
            aValue = (a as any).year || 0;
            bValue = (b as any).year || 0;
            break;
          case 'episodes':
            aValue = a.episodes || 0;
            bValue = b.episodes || 0;
            break;
          default:
            aValue = a.rating || 0;
            bValue = b.rating || 0;
        }

        if (typeof aValue === 'string') {
          return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      });

      return {
        items: filteredResults,
        total: filteredResults.length,
        hasNextPage: false,
        page,
        limit,
      };
    }

    // Search in local database
    const where: any = {};

    if (genres && genres.length > 0) {
      where.genres = {
        some: {
          name: {
            in: genres,
          },
        },
      };
    }

    if (year) {
      where.releaseDate = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      };
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    if (type) {
      where.type = type.toUpperCase();
    }

    if (rating) {
      where.rating = {
        gte: rating,
      };
    }

    const orderBy: any = {};
    switch (sort) {
      case 'title':
        orderBy.title = order;
        break;
      case 'rating':
        orderBy.rating = order;
        break;
      case 'year':
        orderBy.releaseDate = order;
        break;
      case 'episodes':
        orderBy.episodes = order;
        break;
      default:
        orderBy.rating = order;
    }

    const [anime, total] = await Promise.all([
      this.prisma.anime.findMany({
        where,
        include: {
          genres: true,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.anime.count({ where }),
    ]);

    return {
      items: anime,
      total,
      hasNextPage: total > page * limit,
      page,
      limit,
    };
  }

  async getGenres() {
    return this.prisma.genre.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getPopularGenres() {
    const genres = await this.prisma.genre.findMany({
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
      orderBy: {
        animes: {
          _count: 'desc',
        },
      },
      take: 20,
    });

    return genres.map(genre => ({
      ...genre,
      animeCount: genre._count.animes,
    }));
  }

  async getYears() {
    const years = await this.prisma.anime.findMany({
      select: {
        releaseDate: true,
      },
      where: {
        releaseDate: {
          not: null,
        },
      },
    });

    const uniqueYears = [...new Set(
      years
        .map(anime => anime.releaseDate?.getFullYear())
        .filter(year => year)
    )].sort((a, b) => b - a);

    return uniqueYears;
  }

  async getFilters() {
    const [genres, years] = await Promise.all([
      this.getGenres(),
      this.getYears(),
    ]);

    return {
      genres,
      years,
      types: ['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL'],
      statuses: ['ONGOING', 'FINISHED', 'ANNOUNCED'],
      seasons: ['winter', 'spring', 'summer', 'fall'],
    };
  }
}
