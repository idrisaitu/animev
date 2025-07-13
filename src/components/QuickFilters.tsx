'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Clock, 
  Star, 
  Calendar, 
  Heart, 
  Zap, 
  Smile, 
  Sword,
  Sparkles,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface FilterCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
}

interface QuickFiltersProps {
  onFilterSelect: (filter: string, category: string) => void;
  selectedFilters?: string[];
}

export default function QuickFilters({ onFilterSelect, selectedFilters = [] }: QuickFiltersProps) {
  const [activeCategory, setActiveCategory] = useState<string>('popular');

  const categories: FilterCategory[] = [
    {
      id: 'popular',
      name: 'Популярное',
      icon: <Flame className="h-4 w-4" />,
      color: 'from-orange-500 to-red-500',
      count: 156
    },
    {
      id: 'recent',
      name: 'Новинки',
      icon: <Clock className="h-4 w-4" />,
      color: 'from-blue-500 to-cyan-500',
      count: 89
    },
    {
      id: 'top-rated',
      name: 'Топ рейтинг',
      icon: <Star className="h-4 w-4" />,
      color: 'from-yellow-500 to-orange-500',
      count: 234
    },
    {
      id: 'ongoing',
      name: 'Онгоинги',
      icon: <Calendar className="h-4 w-4" />,
      color: 'from-green-500 to-emerald-500',
      count: 67
    },
    {
      id: 'favorites',
      name: 'Избранное',
      icon: <Heart className="h-4 w-4" />,
      color: 'from-pink-500 to-rose-500',
      count: 12
    }
  ];

  const genres = [
    { id: 'action', name: 'Экшен', icon: <Sword className="h-3 w-3" />, count: 342 },
    { id: 'romance', name: 'Романтика', icon: <Heart className="h-3 w-3" />, count: 198 },
    { id: 'comedy', name: 'Комедия', icon: <Smile className="h-3 w-3" />, count: 276 },
    { id: 'fantasy', name: 'Фэнтези', icon: <Sparkles className="h-3 w-3" />, count: 189 },
    { id: 'adventure', name: 'Приключения', icon: <Zap className="h-3 w-3" />, count: 234 },
    { id: 'sports', name: 'Спорт', icon: <Trophy className="h-3 w-3" />, count: 87 }
  ];

  const years = ['2024', '2023', '2022', '2021', '2020', '2019'];
  const statuses = ['Онгоинг', 'Завершен', 'Анонсирован', 'Приостановлен'];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onFilterSelect(categoryId, 'category');
  };

  const handleGenreClick = (genreId: string) => {
    onFilterSelect(genreId, 'genre');
  };

  const handleYearClick = (year: string) => {
    onFilterSelect(year, 'year');
  };

  const handleStatusClick = (status: string) => {
    onFilterSelect(status, 'status');
  };

  return (
    <div className="space-y-6">
      {/* Основные категории */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Категории</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  activeCategory === category.id 
                    ? 'bg-gradient-to-br ' + category.color + ' border-transparent' 
                    : 'bg-card/30 border-border/30 hover:bg-card/50'
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                    activeCategory === category.id 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br ' + category.color
                  }`}>
                    {category.icon}
                  </div>
                  <h4 className="font-medium text-white text-sm mb-1">{category.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Жанры */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Популярные жанры</h3>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant={selectedFilters.includes(genre.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handleGenreClick(genre.id)}
                className={`h-9 ${
                  selectedFilters.includes(genre.id)
                    ? 'bg-primary hover:bg-primary/90'
                    : 'bg-card/30 border-border/30 hover:bg-card/50'
                } transition-all duration-200`}
              >
                {genre.icon}
                <span className="ml-2">{genre.name}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {genre.count}
                </Badge>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Годы и статус */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Годы */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">По годам</h3>
          <div className="flex flex-wrap gap-2">
            {years.map((year, index) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={selectedFilters.includes(year) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleYearClick(year)}
                  className={`${
                    selectedFilters.includes(year)
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-card/30 border-border/30 hover:bg-card/50'
                  } transition-all duration-200`}
                >
                  {year}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Статус */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">По статусу</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status, index) => (
              <motion.div
                key={status}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={selectedFilters.includes(status) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusClick(status)}
                  className={`${
                    selectedFilters.includes(status)
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-card/30 border-border/30 hover:bg-card/50'
                  } transition-all duration-200`}
                >
                  {status}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Активные фильтры */}
      {selectedFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-card/20 rounded-lg border border-border/30"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-white">Активные фильтры</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterSelect('clear', 'all')}
              className="text-xs text-gray-400 hover:text-white"
            >
              Очистить все
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="cursor-pointer hover:bg-red-500/20 transition-colors"
                onClick={() => onFilterSelect(filter, 'remove')}
              >
                {filter} ×
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
