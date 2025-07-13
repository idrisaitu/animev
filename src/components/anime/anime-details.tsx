'use client'

import { useState, useEffect } from 'react';
import { animes, videos } from '@/lib/api';
import type { Anime, Video } from '@/types/anime';
import Image from 'next/image'
import { Star, Calendar, Clock, Play, Plus, Heart, Share, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

interface AnimeDetailsProps {
  animeId: string;
}

export default function AnimeDetails({ animeId }: AnimeDetailsProps) {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [videoSources, setVideoSources] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const data = await animes.getOne(animeId);
        setAnime(data);
        await loadVideoSources(data.id, 1);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load anime details');
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [animeId]);

  const loadVideoSources = async (animeId: string, episode: number) => {
    try {
      const sources = await videos.getByEpisode(animeId, episode);
      setVideoSources(sources);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load video sources');
    }
  };

  const handleEpisodeChange = async (episode: number) => {
    setCurrentEpisode(episode);
    await loadVideoSources(animeId, episode);
  };

  const handleRefreshSources = async () => {
    try {
      const sources = await videos.refreshSources(animeId, currentEpisode);
      setVideoSources(sources);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to refresh video sources');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!anime) {
    return <div>Anime not found</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden rounded-lg">
        <Image
          src={anime.banner || anime.poster}
          alt={anime.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0">
                <Image
                  src={anime.poster}
                  alt={anime.title}
                  width={200}
                  height={280}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              
              {/* Info */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold mb-2">{anime.title}</h1>
                {anime.titleEnglish && (
                  <p className="text-xl text-white/80 mb-4">{anime.titleEnglish}</p>
                )}
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{anime.rating.toFixed(1)}</span>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    anime.status === 'ongoing' && "bg-green-500",
                    anime.status === 'completed' && "bg-blue-500",
                    anime.status === 'upcoming' && "bg-orange-500",
                    anime.status === 'cancelled' && "bg-red-500"
                  )}>
                    {anime.status === 'ongoing' && 'Онгоинг'}
                    {anime.status === 'completed' && 'Завершён'}
                    {anime.status === 'upcoming' && 'Анонс'}
                    {anime.status === 'cancelled' && 'Отменён'}
                  </span>
                  <span>{anime.year}</span>
                  <span>{anime.episodes} эп.</span>
                </div>
                
                <p className="text-white/90 mb-6 line-clamp-3 max-w-2xl">
                  {anime.description}
                </p>
                
                <div className="flex space-x-4">
                  <Button size="lg" variant="anime" className="text-lg px-8">
                    <Play className="mr-2 h-5 w-5" />
                    Смотреть
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Plus className="mr-2 h-5 w-5" />
                    В список
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Heart className="mr-2 h-5 w-5" />
                    В избранное
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4">
        <Tabs.Root defaultValue="overview" className="space-y-6">
          <Tabs.List className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Tabs.Trigger
              value="overview"
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Обзор
            </Tabs.Trigger>
            <Tabs.Trigger
              value="episodes"
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Эпизоды
            </Tabs.Trigger>
            <Tabs.Trigger
              value="characters"
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Персонажи
            </Tabs.Trigger>
            <Tabs.Trigger
              value="reviews"
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Отзывы
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Описание</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {anime.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Жанры</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre) => (
                        <span
                          key={genre}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Тип:</span>
                      <span className="font-medium capitalize">
                        {anime.type === 'tv' && 'TV Сериал'}
                        {anime.type === 'movie' && 'Фильм'}
                        {anime.type === 'ova' && 'OVA'}
                        {anime.type === 'ona' && 'ONA'}
                        {anime.type === 'special' && 'Спешл'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Эпизоды:</span>
                      <span className="font-medium">{anime.episodes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Длительность:</span>
                      <span className="font-medium">{anime.episodeDuration} мин</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Статус:</span>
                      <span className="font-medium">
                        {anime.status === 'ongoing' && 'Онгоинг'}
                        {anime.status === 'completed' && 'Завершён'}
                        {anime.status === 'upcoming' && 'Анонс'}
                        {anime.status === 'cancelled' && 'Отменён'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Год:</span>
                      <span className="font-medium">{anime.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сезон:</span>
                      <span className="font-medium capitalize">
                        {anime.season === 'winter' && 'Зима'}
                        {anime.season === 'spring' && 'Весна'}
                        {anime.season === 'summer' && 'Лето'}
                        {anime.season === 'fall' && 'Осень'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Источник:</span>
                      <span className="font-medium">{anime.source}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Студии</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {anime.studios.map((studio) => (
                        <div key={studio} className="text-sm">
                          {studio}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="episodes">
            <Card>
              <CardHeader>
                <CardTitle>Список эпизодов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: Math.min(anime.episodes, 12) }, (_, i) => (
                    <div
                      key={i + 1}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-sm font-medium">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">Эпизод {i + 1}</h4>
                          <p className="text-sm text-muted-foreground">
                            {anime.episodeDuration} мин
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {anime.episodes > 12 && (
                    <div className="text-center py-4">
                      <Button variant="outline">
                        Показать все {anime.episodes} эпизодов
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="characters">
            <Card>
              <CardHeader>
                <CardTitle>Персонажи</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Информация о персонажах будет добавлена позже
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Отзывы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Отзывы будут добавлены позже
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}
