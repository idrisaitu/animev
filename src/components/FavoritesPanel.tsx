'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Clock, 
  Play, 
  Star, 
  Calendar, 
  Eye, 
  Trash2, 
  Download, 
  Upload,
  X,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFavorites, FavoriteAnime, WatchProgress, WatchHistory } from '@/hooks/useFavorites';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesPanel({ isOpen, onClose }: FavoritesPanelProps) {
  const {
    favorites,
    watchProgress,
    watchHistory,
    loading,
    removeFromFavorites,
    getContinueWatching,
    clearAllData,
    exportData,
    importData
  } = useFavorites();

  const [activeTab, setActiveTab] = useState('favorites');

  const continueWatching = getContinueWatching();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
    return date.toLocaleDateString('ru-RU');
  };

  const formatProgress = (progress: number) => {
    return `${Math.round(progress * 100)}%`;
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anime-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (importData(content)) {
            alert('Данные успешно импортированы!');
          } else {
            alert('Ошибка при импорте данных!');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/30">
            <h2 className="text-2xl font-bold text-white">Моя библиотека</h2>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Экспорт данных
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImport}>
                    <Upload className="h-4 w-4 mr-2" />
                    Импорт данных
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      if (confirm('Вы уверены, что хотите очистить все данные?')) {
                        clearAllData();
                      }
                    }}
                    className="text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Очистить все
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Избранное ({favorites.length})
                </TabsTrigger>
                <TabsTrigger value="continue" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Продолжить ({continueWatching.length})
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Прогресс ({watchProgress.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  История ({watchHistory.length})
                </TabsTrigger>
              </TabsList>

              {/* Favorites Tab */}
              <TabsContent value="favorites">
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Нет избранного</h3>
                    <p className="text-gray-400">Добавьте аниме в избранное, чтобы они появились здесь</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((anime) => (
                      <motion.div
                        key={anime.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        layout
                      >
                        <Card className="group bg-card/30 border-border/30 hover:bg-card/50 transition-all duration-300 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <img
                                src={anime.image}
                                alt={anime.title}
                                className="w-16 h-20 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                                  {anime.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                  {anime.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span>{anime.rating}</span>
                                    </div>
                                  )}
                                  {anime.year && <span>{anime.year}</span>}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    {formatTime(anime.addedAt)}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeFromFavorites(anime.id)}
                                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                  >
                                    <Heart className="h-3 w-3" fill="currentColor" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Continue Watching Tab */}
              <TabsContent value="continue">
                {continueWatching.length === 0 ? (
                  <div className="text-center py-12">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Нет незавершенных эпизодов</h3>
                    <p className="text-gray-400">Начните смотреть аниме, чтобы они появились здесь</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {continueWatching.map((progress) => (
                      <motion.div
                        key={`${progress.animeId}-${progress.episodeId}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        layout
                      >
                        <Card className="bg-card/30 border-border/30 hover:bg-card/50 transition-all duration-300 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={progress.image}
                                alt={progress.title}
                                className="w-20 h-28 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-white mb-1">{progress.title}</h3>
                                <p className="text-sm text-gray-400 mb-2">
                                  Эпизод {progress.episodeNumber}
                                </p>
                                <div className="mb-2">
                                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                    <span>Прогресс</span>
                                    <span>{formatProgress(progress.progress)}</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${progress.progress * 100}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    {formatTime(progress.watchedAt)}
                                  </span>
                                  <Button size="sm" className="h-7">
                                    <Play className="h-3 w-3 mr-1" />
                                    Продолжить
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Progress Tab */}
              <TabsContent value="progress">
                {watchProgress.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Нет прогресса просмотра</h3>
                    <p className="text-gray-400">Прогресс будет отображаться после начала просмотра</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {watchProgress
                      .sort((a, b) => b.watchedAt - a.watchedAt)
                      .slice(0, 20)
                      .map((progress) => (
                        <motion.div
                          key={`${progress.animeId}-${progress.episodeId}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 bg-card/20 rounded-lg"
                        >
                          <img
                            src={progress.image}
                            alt={progress.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-white text-sm">{progress.title}</h4>
                            <p className="text-xs text-gray-400">Эпизод {progress.episodeNumber}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-white">
                              {formatProgress(progress.progress)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(progress.watchedAt)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                {watchHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Нет истории просмотров</h3>
                    <p className="text-gray-400">История будет отображаться после просмотра эпизодов</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {watchHistory
                      .sort((a, b) => b.watchedAt - a.watchedAt)
                      .slice(0, 30)
                      .map((item) => (
                        <motion.div
                          key={`${item.animeId}-${item.episodeNumber}-${item.watchedAt}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 bg-card/20 rounded-lg hover:bg-card/30 transition-colors cursor-pointer"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-white text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-400">Эпизод {item.episodeNumber}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-primary">
                              {formatProgress(item.progress)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(item.watchedAt)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
