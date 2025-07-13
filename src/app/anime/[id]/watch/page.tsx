'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
// API imports removed - using fetch directly
import type { Anime } from '@/types/anime';
import { Video } from '@/types/video';
import VideoPlayer from '@/components/anime/video-player';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, ArrowLeft, List, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const animeId = params.id as string;
  const initialEpisode = parseInt(searchParams.get('episode') || '1');

  const [anime, setAnime] = useState<Anime | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [videoSources, setVideoSources] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSources, setLoadingSources] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEpisodeList, setShowEpisodeList] = useState(false);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch(`/api/anime/${animeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch anime details');
        }
        const data = await response.json();
        setAnime(data);
        await loadVideoSources(data.id, currentEpisode);
      } catch (err: any) {
        setError(err.message || 'Failed to load anime details');
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [animeId]);

  const loadVideoSources = async (animeId: string, episode: number) => {
    setLoadingSources(true);
    try {
      // For now, use demo video sources
      const demoSources = [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          quality: '1080p',
          type: 'mp4'
        },
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          quality: '720p',
          type: 'mp4'
        }
      ];
      setVideoSources(demoSources);
    } catch (err: any) {
      console.error('Failed to load video sources:', err);
      setVideoSources([]);
    } finally {
      setLoadingSources(false);
    }
  };

  const handleEpisodeChange = async (episode: number) => {
    setCurrentEpisode(episode);
    await loadVideoSources(animeId, episode);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('episode', episode.toString());
    window.history.replaceState({}, '', url.toString());
  };

  const handleRefreshSources = async () => {
    setLoadingSources(true);
    try {
      // Reload video sources
      await loadVideoSources(animeId, currentEpisode);
    } catch (err: any) {
      console.error('Failed to refresh video sources:', err);
    } finally {
      setLoadingSources(false);
    }
  };

  const handleProgress = async (progress: number) => {
    if (anime) {
      try {
        // Store progress in localStorage for now
        const progressKey = `anime-${anime.id}-ep-${currentEpisode}-progress`;
        localStorage.setItem(progressKey, progress.toString());
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Аниме не найдено'}</p>
          <Link href="/">
            <Button>Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href={`/anime/${anime.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{anime.title}</h1>
              <p className="text-muted-foreground">Эпизод {currentEpisode}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEpisodeList(!showEpisodeList)}
            >
              <List className="h-4 w-4 mr-2" />
              Эпизоды
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshSources}
              disabled={loadingSources}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loadingSources && "animate-spin")} />
              Обновить
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {loadingSources ? (
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Загрузка видео...</p>
                  </div>
                </div>
              ) : (
                <VideoPlayer
                  sources={videoSources.map(source => ({
                    id: source.id,
                    url: source.url,
                    quality: source.quality || '720p',
                    source: source.source,
                  }))}
                  title={anime.title}
                  episode={currentEpisode}
                  totalEpisodes={anime.episodes}
                  onEpisodeChange={handleEpisodeChange}
                  onProgress={handleProgress}
                />
              )}

              {videoSources.length === 0 && !loadingSources && (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg mb-2">Видео не найдено</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Попробуйте обновить источники или выберите другой эпизод
                    </p>
                    <Button onClick={handleRefreshSources}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Обновить источники
                    </Button>
                  </div>
                </div>
              )}

              {/* Episode Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleEpisodeChange(currentEpisode - 1)}
                  disabled={currentEpisode <= 1}
                >
                  Предыдущий эпизод
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentEpisode} из {anime.episodes}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handleEpisodeChange(currentEpisode + 1)}
                  disabled={currentEpisode >= anime.episodes}
                >
                  Следующий эпизод
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Episode List */}
            {(showEpisodeList || window.innerWidth >= 1024) && (
              <Card>
                <CardHeader>
                  <CardTitle>Эпизоды</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {Array.from({ length: anime.episodes }, (_, i) => (
                      <button
                        key={i + 1}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-colors",
                          currentEpisode === i + 1
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                        onClick={() => handleEpisodeChange(i + 1)}
                      >
                        <div className="font-medium">Эпизод {i + 1}</div>
                        <div className="text-sm opacity-80">
                          {anime.duration} min
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Anime Info */}
            <Card>
              <CardHeader>
                <CardTitle>Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Статус</p>
                  <p className="font-medium">
                    {anime.status === 'ONGOING' && 'Онгоинг'}
                    {anime.status === 'COMPLETED' && 'Завершён'}
                    {anime.status === 'UPCOMING' && 'Анонс'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Эпизоды</p>
                  <p className="font-medium">{anime.episodes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Рейтинг</p>
                  <p className="font-medium">{anime.rating.toFixed(1)}/10</p>
                </div>
              </CardContent>
            </Card>

            {/* Comments placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Комментарии
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-4">
                  Комментарии будут добавлены в будущих обновлениях
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
