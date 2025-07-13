'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  Search,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Star,
  Calendar,
  Play,
  Eye,
  Heart,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FavoriteButton from '@/components/FavoriteButton';
import Breadcrumbs from '@/components/Breadcrumbs';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { animes } from '@/lib/api';
import type { Anime, Genre } from '@/types/anime';

interface AnimeItem extends Anime {
  image: string;
  views?: number;
}

interface FilterState {
  search: string;
  genres: string[];
  years: string[];
  status: string[];
  rating: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function CatalogPage() {
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    genres: [],
    years: [],
    status: [],
    rating: '',
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const availableGenres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
    'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural',
    'Thriller', 'Mystery', 'Historical', 'School', 'Superhero',
    'Martial Arts', 'Psychological', 'Family'
  ];

  const availableYears = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2011', '2006', '2003', '2002', '2001', '1999'];
  const availableStatuses = ['Ongoing', 'Completed', 'Upcoming', 'Hiatus'];
  const sortOptions = [
    { value: 'rating', label: 'Рейтинг' },
    { value: 'title', label: 'Название' },
    { value: 'year', label: 'Год' },
    { value: 'episodes', label: 'Эпизоды' },
    { value: 'views', label: 'Просмотры' }
  ];

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search,
        orderBy: { [filters.sortBy]: filters.sortOrder },
        where: {},
      };

      if (filters.genres.length > 0) {
        params.where.genres = { some: { name: { in: filters.genres } } };
      }
      if (filters.status.length > 0) {
        params.where.status = { in: filters.status };
      }
      if (filters.years.length > 0) {
        params.where.year = { in: filters.years.map(Number) };
      }
      if (filters.rating) {
        params.where.rating = { gte: parseFloat(filters.rating) };
      }

      const response = await animes.getAll(params);
      
      setAnimeList(response.items.map((item: Anime) => ({
        ...item,
        image: item.image || `https://via.placeholder.com/300x400?text=${item.title.replace(' ', '+')}`
      })));
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (err) {
      setError('Не удалось загрузить список аниме. Попробуйте позже.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'genres' | 'years' | 'status', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      genres: [],
      years: [],
      status: [],
      rating: '',
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  };

  const paginatedAnime = animeList;

  return (
    <div className="min-h-screen hero-gradient">
      <Navigation />
      <MobileNavigation />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4">
            КАТАЛОГ <span className="text-gradient-orange">АНИМЕ</span>
          </h1>
          <p className="text-gray-300 text-xl">
            Найдите идеальное аниме среди <span className="text-orange-400 font-bold">{animeList.length}</span> тайтлов
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-4"></div>
        </div>

        {/* Search and Controls */}
        <Card className="card-crunchyroll mb-12 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 h-5 w-5" />
                <Input
                  placeholder="Поиск по названию..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="input-crunchyroll pl-12 h-14 text-lg"
                />
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-slate-800/50 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500 text-white h-14 px-6"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-card/50 border-border/50">
                      {sortOptions.find(opt => opt.value === filters.sortBy)?.label}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {sortOptions.map(option => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => updateFilter('sortBy', option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="bg-card/50 border-border/50"
                >
                  {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>

                <div className="flex border border-border/50 rounded-lg bg-card/50">
                  <Button
                    variant={viewMode === 'grid' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Results info */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Найдено: {animeList.length} аниме</span>
            <span>Страница {currentPage} из {totalPages}</span>
          </div>
        </Card>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Фильтры</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Очистить все
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Genres */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Жанры</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {availableGenres.map(genre => (
                          <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.genres.includes(genre)}
                              onChange={() => toggleArrayFilter('genres', genre)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-300">{genre}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Years */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Годы</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {availableYears.map(year => (
                          <label key={year} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.years.includes(year)}
                              onChange={() => toggleArrayFilter('years', year)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-300">{year}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Статус</h4>
                      <div className="space-y-2">
                        {availableStatuses.map(status => (
                          <label key={status} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.status.includes(status)}
                              onChange={() => toggleArrayFilter('status', status)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-300">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Минимальный рейтинг</h4>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="8.0"
                        value={filters.rating}
                        onChange={(e) => updateFilter('rating', e.target.value)}
                        className="bg-card/30 border-border/30"
                      />
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(filters.genres.length > 0 || filters.years.length > 0 || filters.status.length > 0 || filters.rating) && (
                    <div className="mt-6 pt-6 border-t border-border/30">
                      <h4 className="text-sm font-medium text-white mb-3">Активные фильтры</h4>
                      <div className="flex flex-wrap gap-2">
                        {filters.genres.map(genre => (
                          <Badge key={genre} variant="secondary" className="cursor-pointer" onClick={() => toggleArrayFilter('genres', genre)}>
                            {genre} ×
                          </Badge>
                        ))}
                        {filters.years.map(year => (
                          <Badge key={year} variant="secondary" className="cursor-pointer" onClick={() => toggleArrayFilter('years', year)}>
                            {year} ×
                          </Badge>
                        ))}
                        {filters.status.map(status => (
                          <Badge key={status} variant="secondary" className="cursor-pointer" onClick={() => toggleArrayFilter('status', status)}>
                            {status} ×
                          </Badge>
                        ))}
                        {filters.rating && (
                          <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('rating', '')}>
                            Рейтинг ≥ {filters.rating} ×
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            : 'grid-cols-1'
        }`}>
          {paginatedAnime.map((anime, index) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {viewMode === 'grid' ? (
                <Card className="group bg-card/30 border-border/30 hover:bg-card/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={anime.image}
                        alt={anime.title}
                        className="w-full h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="lg" className="rounded-full bg-primary/90 hover:bg-primary">
                          <Play className="h-6 w-6 ml-1" fill="currentColor" />
                        </Button>
                      </div>

                      {/* Status badge */}
                      {anime.status && (
                        <Badge
                          variant={anime.status === 'ONGOING' ? 'default' : 'secondary'}
                          className="absolute top-3 right-3"
                        >
                          {anime.status}
                        </Badge>
                      )}

                      {/* Favorite button */}
                      <div className="absolute top-3 left-3">
                        <FavoriteButton
                          anime={{
                            id: anime.id,
                            title: anime.title,
                            image: anime.image || '',
                            rating: anime.rating,
                            year: new Date(anime.releaseDate).getFullYear().toString(),
                            episodes: anime.episodes,
                            status: anime.status,
                            genres: anime.genres.map(g => g.name),
                            description: anime.description
                          }}
                          size="sm"
                          variant="ghost"
                          className="bg-black/50 hover:bg-black/70"
                        />
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {anime.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        {anime.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{anime.rating}</span>
                          </div>
                        )}
                        {anime.releaseDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(anime.releaseDate).getFullYear()}</span>
                          </div>
                        )}
                        {anime.episodes && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{anime.episodes} эп.</span>
                          </div>
                        )}
                      </div>

                      {anime.genres && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {anime.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre.id} variant="outline" className="text-xs">
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card/30 border-border/30 hover:bg-card/50 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={anime.image}
                        alt={anime.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">{anime.title}</h3>
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">{anime.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                          {anime.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{anime.rating}</span>
                            </div>
                          )}
                          {anime.releaseDate && <span>{new Date(anime.releaseDate).getFullYear()}</span>}
                          {anime.episodes && <span>{anime.episodes} эп.</span>}
                          {anime.views && <span>{(anime.views / 1000000).toFixed(1)}M просмотров</span>}
                        </div>

                        {anime.genres && (
                          <div className="flex flex-wrap gap-1">
                            {anime.genres.map((genre) => (
                              <Badge key={genre.id} variant="outline" className="text-xs">
                                {genre.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Смотреть
                        </Button>
                        <FavoriteButton
                          anime={{
                            id: anime.id,
                            title: anime.title,
                            image: anime.image || '',
                            rating: anime.rating,
                            year: new Date(anime.releaseDate).getFullYear().toString(),
                            episodes: anime.episodes,
                            status: anime.status,
                            genres: anime.genres.map(g => g.name),
                            description: anime.description
                          }}
                          size="sm"
                          variant="outline"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {loading && (
          <div className="text-center py-16 text-white">
            Загрузка...
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-16 text-red-500">
            {error}
          </div>
        )}
        {!loading && !error && animeList.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-white mb-2">Ничего не найдено</h3>
            <p className="text-gray-400 mb-4">Попробуйте изменить параметры поиска или фильтры</p>
            <Button onClick={clearFilters}>Сбросить фильтры</Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-card/50 border-border/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="bg-card/50 border-border/50"
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="bg-card/50 border-border/50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
