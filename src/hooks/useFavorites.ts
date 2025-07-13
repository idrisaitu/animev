'use client';

import { useState, useEffect } from 'react';

export interface FavoriteAnime {
  id: string;
  title: string;
  image: string;
  rating?: number;
  year?: string;
  episodes?: number;
  status?: string;
  genres?: string[];
  description?: string;
  addedAt: number;
}

export interface WatchProgress {
  animeId: string;
  episodeId: string;
  episodeNumber: number;
  progress: number; // 0-1
  duration: number;
  watchedAt: number;
  title: string;
  image: string;
}

export interface WatchHistory {
  id: string;
  animeId: string;
  title: string;
  image: string;
  episodeNumber: number;
  watchedAt: number;
  progress: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteAnime[]>([]);
  const [watchProgress, setWatchProgress] = useState<WatchProgress[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('anime-favorites');
      const savedProgress = localStorage.getItem('anime-watch-progress');
      const savedHistory = localStorage.getItem('anime-watch-history');

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      if (savedProgress) {
        setWatchProgress(JSON.parse(savedProgress));
      }
      if (savedHistory) {
        setWatchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Сохранение избранного в localStorage
  const saveFavorites = (newFavorites: FavoriteAnime[]) => {
    try {
      localStorage.setItem('anime-favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Сохранение прогресса просмотра
  const saveWatchProgress = (newProgress: WatchProgress[]) => {
    try {
      localStorage.setItem('anime-watch-progress', JSON.stringify(newProgress));
      setWatchProgress(newProgress);
    } catch (error) {
      console.error('Error saving watch progress:', error);
    }
  };

  // Сохранение истории просмотров
  const saveWatchHistory = (newHistory: WatchHistory[]) => {
    try {
      localStorage.setItem('anime-watch-history', JSON.stringify(newHistory));
      setWatchHistory(newHistory);
    } catch (error) {
      console.error('Error saving watch history:', error);
    }
  };

  // Добавить в избранное
  const addToFavorites = (anime: Omit<FavoriteAnime, 'addedAt'>) => {
    const newFavorite: FavoriteAnime = {
      ...anime,
      addedAt: Date.now()
    };
    const newFavorites = [newFavorite, ...favorites.filter(fav => fav.id !== anime.id)];
    saveFavorites(newFavorites);
  };

  // Удалить из избранного
  const removeFromFavorites = (animeId: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== animeId);
    saveFavorites(newFavorites);
  };

  // Проверить, находится ли аниме в избранном
  const isFavorite = (animeId: string) => {
    return favorites.some(fav => fav.id === animeId);
  };

  // Переключить избранное
  const toggleFavorite = (anime: Omit<FavoriteAnime, 'addedAt'>) => {
    if (isFavorite(anime.id)) {
      removeFromFavorites(anime.id);
    } else {
      addToFavorites(anime);
    }
  };

  // Обновить прогресс просмотра
  const updateWatchProgress = (progress: Omit<WatchProgress, 'watchedAt'>) => {
    const newProgress: WatchProgress = {
      ...progress,
      watchedAt: Date.now()
    };
    
    const existingIndex = watchProgress.findIndex(
      p => p.animeId === progress.animeId && p.episodeId === progress.episodeId
    );
    
    let newProgressList;
    if (existingIndex >= 0) {
      newProgressList = [...watchProgress];
      newProgressList[existingIndex] = newProgress;
    } else {
      newProgressList = [newProgress, ...watchProgress];
    }
    
    // Ограничиваем до 100 записей
    if (newProgressList.length > 100) {
      newProgressList = newProgressList.slice(0, 100);
    }
    
    saveWatchProgress(newProgressList);
  };

  // Добавить в историю просмотров
  const addToWatchHistory = (historyItem: Omit<WatchHistory, 'watchedAt'>) => {
    const newHistoryItem: WatchHistory = {
      ...historyItem,
      watchedAt: Date.now()
    };
    
    // Удаляем дубликаты и добавляем новую запись в начало
    const newHistory = [
      newHistoryItem,
      ...watchHistory.filter(item => 
        !(item.animeId === historyItem.animeId && item.episodeNumber === historyItem.episodeNumber)
      )
    ];
    
    // Ограничиваем до 50 записей
    if (newHistory.length > 50) {
      newHistory.splice(50);
    }
    
    saveWatchHistory(newHistory);
  };

  // Получить прогресс для конкретного эпизода
  const getEpisodeProgress = (animeId: string, episodeId: string) => {
    return watchProgress.find(p => p.animeId === animeId && p.episodeId === episodeId);
  };

  // Получить последний просмотренный эпизод аниме
  const getLastWatchedEpisode = (animeId: string) => {
    const animeProgress = watchProgress
      .filter(p => p.animeId === animeId)
      .sort((a, b) => b.watchedAt - a.watchedAt);
    
    return animeProgress[0];
  };

  // Получить продолжение просмотра (аниме с незавершенными эпизодами)
  const getContinueWatching = () => {
    const continueWatching = watchProgress
      .filter(p => p.progress < 0.9) // Эпизоды, просмотренные менее чем на 90%
      .sort((a, b) => b.watchedAt - a.watchedAt)
      .slice(0, 10); // Последние 10
    
    return continueWatching;
  };

  // Очистить все данные
  const clearAllData = () => {
    localStorage.removeItem('anime-favorites');
    localStorage.removeItem('anime-watch-progress');
    localStorage.removeItem('anime-watch-history');
    setFavorites([]);
    setWatchProgress([]);
    setWatchHistory([]);
  };

  // Экспорт данных
  const exportData = () => {
    const data = {
      favorites,
      watchProgress,
      watchHistory,
      exportedAt: Date.now()
    };
    return JSON.stringify(data, null, 2);
  };

  // Импорт данных
  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.favorites) saveFavorites(data.favorites);
      if (data.watchProgress) saveWatchProgress(data.watchProgress);
      if (data.watchHistory) saveWatchHistory(data.watchHistory);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  return {
    // Состояние
    favorites,
    watchProgress,
    watchHistory,
    loading,
    
    // Избранное
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    
    // Прогресс просмотра
    updateWatchProgress,
    getEpisodeProgress,
    getLastWatchedEpisode,
    getContinueWatching,
    
    // История
    addToWatchHistory,
    
    // Утилиты
    clearAllData,
    exportData,
    importData
  };
}
