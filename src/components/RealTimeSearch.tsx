'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, TrendingUp, Clock, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/hooks/useFavorites';

interface SearchResult {
  id: string;
  title: string;
  type: 'anime' | 'character' | 'genre' | 'studio';
  image?: string;
  year?: string;
  rating?: number;
  status?: string;
  genres?: string[];
  description?: string;
}

interface RealTimeSearchProps {
  placeholder?: string;
  className?: string;
  onResultClick?: (result: SearchResult) => void;
  showTrending?: boolean;
  showRecent?: boolean;
  maxResults?: number;
}

export default function RealTimeSearch({
  placeholder = "Поиск аниме в реальном времени...",
  className = "",
  onResultClick,
  showTrending = true,
  showRecent = true,
  maxResults = 8
}: RealTimeSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { favorites } = useFavorites();

  // Демо данные для поиска
  const demoData: SearchResult[] = [
    {
      id: '1',
      title: 'Attack on Titan',
      type: 'anime',
      image: 'https://via.placeholder.com/50x70/FF6B35/FFFFFF?text=AOT',
      year: '2013',
      rating: 9.0,
      status: 'Completed',
      genres: ['Action', 'Drama', 'Fantasy'],
      description: 'Humanity fights for survival against giant humanoid Titans.'
    },
    {
      id: '2',
      title: 'Demon Slayer',
      type: 'anime',
      image: 'https://via.placeholder.com/50x70/4ECDC4/FFFFFF?text=DS',
      year: '2019',
      rating: 8.7,
      status: 'Ongoing',
      genres: ['Action', 'Supernatural'],
      description: 'A young boy becomes a demon slayer to save his sister.'
    },
    {
      id: '3',
      title: 'One Piece',
      type: 'anime',
      image: 'https://via.placeholder.com/50x70/45B7D1/FFFFFF?text=OP',
      year: '1999',
      rating: 9.2,
      status: 'Ongoing',
      genres: ['Adventure', 'Comedy', 'Action'],
      description: 'Pirates search for the ultimate treasure, One Piece.'
    },
    {
      id: '4',
      title: 'Naruto Uzumaki',
      type: 'character',
      image: 'https://via.placeholder.com/50x70/96CEB4/FFFFFF?text=N',
      description: 'Main protagonist of Naruto series.'
    },
    {
      id: '5',
      title: 'Studio Ghibli',
      type: 'studio',
      description: 'Famous Japanese animation studio.'
    },
    {
      id: '6',
      title: 'Action',
      type: 'genre',
      description: 'High-energy anime with fighting and adventure.'
    }
  ];

  const trendingSearches = [
    'Attack on Titan', 'Demon Slayer', 'One Piece', 'Jujutsu Kaisen', 
    'My Hero Academia', 'Death Note', 'Naruto', 'Hunter x Hunter'
  ];

  // Загрузка недавних поисков
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Поиск с задержкой
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Имитация API запроса с задержкой
      setTimeout(() => {
        const filtered = demoData.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.genres?.some(genre => 
            genre.toLowerCase().includes(searchQuery.toLowerCase())
          )
        ).slice(0, maxResults);
        
        setResults(filtered);
        setIsLoading(false);
      }, 300);
    },
    [maxResults]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Обработка клавиш
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Обработка клика на результат
  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(result.title);
    setQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
    
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Навигация по умолчанию
      if (result.type === 'anime') {
        router.push(`/anime/${result.id}`);
      } else if (result.type === 'genre') {
        router.push(`/catalog?genre=${encodeURIComponent(result.title)}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(result.title)}`);
      }
    }
  };

  // Обработка поиска
  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    saveRecentSearch(trimmed);
    setQuery('');
    setShowResults(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  // Сохранение недавнего поиска
  const saveRecentSearch = (searchQuery: string) => {
    const newRecent = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 10);
    
    setRecentSearches(newRecent);
    localStorage.setItem('recent-searches', JSON.stringify(newRecent));
  };

  // Обработка клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'anime': return '🎬';
      case 'character': return '👤';
      case 'genre': return '🏷️';
      case 'studio': return '🏢';
      default: return '🔍';
    }
  };

  const getTypeBadge = (type: SearchResult['type']) => {
    const variants = {
      anime: 'default',
      character: 'secondary',
      genre: 'outline',
      studio: 'destructive'
    } as const;

    const labels = {
      anime: 'Аниме',
      character: 'Персонаж',
      genre: 'Жанр',
      studio: 'Студия'
    };

    return (
      <Badge variant={variants[type]} className="text-xs">
        {labels[type]}
      </Badge>
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-card/50 border-border/50 text-white placeholder-gray-400"
        />
        {isLoading && (
          <Loader2 className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
        )}
        {query && !isLoading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="bg-card/95 backdrop-blur-md border-border/50 shadow-2xl max-h-96 overflow-hidden">
              <CardContent className="p-0">
                {/* Search Results */}
                {query.trim() && (
                  <div className="border-b border-border/30">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-4 text-gray-400">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Поиск...
                      </div>
                    ) : results.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                        {results.map((result, index) => (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                              selectedIndex === index 
                                ? 'bg-primary/20' 
                                : 'hover:bg-card/50'
                            }`}
                            onClick={() => handleResultClick(result)}
                          >
                            {result.image ? (
                              <img
                                src={result.image}
                                alt={result.title}
                                className="w-10 h-14 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-14 bg-gradient-to-br from-orange-500 to-blue-600 rounded flex items-center justify-center text-lg">
                                {getTypeIcon(result.type)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-white truncate">{result.title}</h4>
                                {getTypeBadge(result.type)}
                              </div>
                              {result.description && (
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  {result.description}
                                </p>
                              )}
                              {result.year && result.rating && (
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                  <span>{result.year}</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{result.rating}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        Ничего не найдено
                      </div>
                    )}
                  </div>
                )}

                {/* Recent Searches */}
                {!query.trim() && showRecent && recentSearches.length > 0 && (
                  <div className="border-b border-border/30">
                    <div className="flex items-center justify-between p-3 border-b border-border/20">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <Clock className="h-4 w-4" />
                        Недавние поиски
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem('recent-searches');
                        }}
                        className="text-xs text-gray-400 hover:text-white h-6"
                      >
                        Очистить
                      </Button>
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 hover:bg-card/50 cursor-pointer transition-colors"
                          onClick={() => handleSearch(search)}
                        >
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{search}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                {!query.trim() && showTrending && (
                  <div>
                    <div className="flex items-center gap-2 p-3 border-b border-border/20 text-sm font-medium text-gray-300">
                      <TrendingUp className="h-4 w-4" />
                      Популярные поиски
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      {trendingSearches.slice(0, 5).map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 hover:bg-card/50 cursor-pointer transition-colors"
                          onClick={() => handleSearch(search)}
                        >
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{search}</span>
                        </div>
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
