'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface SearchSuggestion {
  id: string;
  title: string;
  image?: string;
  type: 'anime' | 'genre' | 'recent';
  rating?: number;
  year?: string;
}

interface SearchWithAutocompleteProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchWithAutocomplete({ 
  onSearch, 
  placeholder = "Найти аниме, персонажей, жанры...",
  className = ""
}: SearchWithAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Демо данные для автодополнения
  const demoSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      title: 'Attack on Titan',
      image: 'https://via.placeholder.com/50x70/FF6B35/FFFFFF?text=AOT',
      type: 'anime',
      rating: 9.0,
      year: '2013'
    },
    {
      id: '2',
      title: 'Demon Slayer',
      image: 'https://via.placeholder.com/50x70/4ECDC4/FFFFFF?text=DS',
      type: 'anime',
      rating: 8.7,
      year: '2019'
    },
    {
      id: '3',
      title: 'One Piece',
      image: 'https://via.placeholder.com/50x70/45B7D1/FFFFFF?text=OP',
      type: 'anime',
      rating: 9.2,
      year: '1999'
    },
    {
      id: '4',
      title: 'Action',
      type: 'genre'
    },
    {
      id: '5',
      title: 'Romance',
      type: 'genre'
    },
    {
      id: '6',
      title: 'Comedy',
      type: 'genre'
    }
  ];

  const trendingSearches = [
    'Attack on Titan', 'Demon Slayer', 'One Piece', 'Naruto', 'My Hero Academia'
  ];

  // Загружаем недавние поиски из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Обработка поиска с задержкой
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 0) {
        setIsLoading(true);
        // Имитация API запроса
        setTimeout(() => {
          const filtered = demoSuggestions.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered);
          setIsLoading(false);
        }, 300);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Сохраняем в недавние поиски
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      
      onSearch(searchQuery);
      setQuery(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          className="pl-12 pr-12 h-14 bg-card/50 border-border/50 rounded-xl backdrop-blur-sm focus:bg-card focus:border-primary/50 transition-all duration-300 text-lg"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="bg-card/95 backdrop-blur-md border-border/50 shadow-2xl">
              <CardContent className="p-0">
                {/* Результаты поиска */}
                {query && suggestions.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Результаты поиска</h4>
                    <div className="space-y-2">
                      {suggestions.map((suggestion) => (
                        <motion.div
                          key={suggestion.id}
                          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer"
                          onClick={() => handleSearch(suggestion.title)}
                        >
                          {suggestion.image && (
                            <img
                              src={suggestion.image}
                              alt={suggestion.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{suggestion.title}</span>
                              {suggestion.type === 'anime' && suggestion.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-gray-400">{suggestion.rating}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {suggestion.type === 'anime' ? 'Аниме' : 'Жанр'}
                              </Badge>
                              {suggestion.year && (
                                <span className="text-xs text-gray-400">{suggestion.year}</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Загрузка */}
                {query && isLoading && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm">Поиск...</span>
                    </div>
                  </div>
                )}

                {/* Недавние поиски */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-4 border-b border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Недавние поиски
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-300"
                      >
                        Очистить
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                          className="flex items-center gap-2 p-2 rounded-lg cursor-pointer"
                          onClick={() => handleSearch(search)}
                        >
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-white">{search}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Популярные поиски */}
                {!query && (
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4" />
                      Популярные поиски
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary/20 transition-colors"
                          onClick={() => handleSearch(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
