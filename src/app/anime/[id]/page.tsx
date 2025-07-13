'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Play,
  Calendar,
  Star,
  Clock,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Heart
} from 'lucide-react';

import type { Anime } from '@/types/anime';

interface AnimeEpisode {
  id: string;
  number: number;
  title?: string;
  image?: string;
  description?: string;
}

interface AnimeInfo extends Omit<Anime, 'genres' | 'episodes'> {
  genres: string[];
  totalEpisodes?: number;
  episodes: AnimeEpisode[];
  studios?: string[];
}

export default function AnimeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const animeId = params.id as string;

  const [animeInfo, setAnimeInfo] = useState<AnimeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/anime/${animeId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch anime: ${response.status}`);
        }

        const data = await response.json();
        const animeData: AnimeInfo = {
          ...data,
          genres: data.genres?.map((g: any) => typeof g === 'string' ? g : g.name) || [],
          episodes: Array.from({ length: data.episodes || 12 }, (_, i) => ({
            id: `${data.id}-ep-${i + 1}`,
            number: i + 1,
            title: `Episode ${i + 1}`,
          })),
          totalEpisodes: data.episodes || 12,
        };
        setAnimeInfo(animeData);
      } catch (error) {
        console.error('Error fetching anime info:', error);
        setError('Не удалось загрузить информацию об аниме');
      } finally {
        setLoading(false);
      }
    };

    if (animeId) {
      fetchAnimeInfo();
    }
  }, [animeId]);

  const handleWatchEpisode = (episodeNumber: number) => {
    router.push(`/watch/${animeId}/${episodeNumber}`);
  };

  const handleWatchFirst = () => {
    if (animeInfo?.episodes && animeInfo.episodes.length > 0) {
      handleWatchEpisode(1);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Загрузка информации об аниме...</p>
        </div>
      </div>
    );
  }

  if (error || !animeInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Аниме не найдено</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.back()}>
              Назад
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Навигация */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>

        {/* Основная информация */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Постер */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src={animeInfo.image}
                alt={animeInfo.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          </div>

          {/* Информация */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{animeInfo.title}</h1>

              {/* Жанры */}
              {animeInfo.genres && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {animeInfo.genres.map((genre, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-600 text-white text-sm rounded">
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Метаинформация */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {animeInfo.rating && (
                  <div className="flex items-center text-white/80">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    <span>{animeInfo.rating}/10</span>
                  </div>
                )}

                {animeInfo.releaseDate && (
                  <div className="flex items-center text-white/80">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{animeInfo.releaseDate}</span>
                  </div>
                )}

                {animeInfo.totalEpisodes && (
                  <div className="flex items-center text-white/80">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{animeInfo.totalEpisodes} эп.</span>
                  </div>
                )}

                {animeInfo.status && (
                  <div className="flex items-center text-white/80">
                    <span className="px-3 py-1 bg-orange-500/20 rounded-full text-orange-400 text-sm">
                      {animeInfo.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Описание */}
              {animeInfo.description && (
                <p className="text-white/80 leading-relaxed mb-6">
                  {animeInfo.description}
                </p>
              )}

              {/* Кнопки действий */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={handleWatchFirst}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!animeInfo.episodes || animeInfo.episodes.length === 0}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Смотреть
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  В избранное
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10 mb-8" />

        {/* Список эпизодов */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Эпизоды {animeInfo.totalEpisodes && `(${animeInfo.totalEpisodes})`}
          </h2>

          {animeInfo.episodes && animeInfo.episodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {animeInfo.episodes.map((episode) => (
                <Card
                  key={episode.id}
                  className="bg-black/20 border-white/10 hover:bg-black/30 transition-colors cursor-pointer"
                  onClick={() => handleWatchEpisode(episode.number)}
                >
                  <CardContent className="p-4">
                    {episode.image && (
                      <div className="relative aspect-video rounded-md overflow-hidden mb-3">
                        <Image
                          src={episode.image}
                          alt={episode.title || `Эпизод ${episode.number}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}

                    <h3 className="text-white font-semibold mb-1">
                      Эпизод {episode.number}
                    </h3>

                    {episode.title && (
                      <p className="text-white/70 text-sm mb-2 line-clamp-2">
                        {episode.title}
                      </p>
                    )}

                    {episode.description && (
                      <p className="text-white/60 text-xs line-clamp-3">
                        {episode.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-black/20 border-white/10">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">Эпизоды не найдены</p>
                <p className="text-white/50 text-sm mt-2">
                  Возможно, информация об эпизодах еще не доступна
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


