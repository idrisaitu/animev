'use client';

import { useState, useEffect } from 'react';
import type { Anime } from '@/types/anime';
import { Button } from '@/components/ui/button';
import AnimeCarousel from '@/components/AnimeCarousel';
import Navigation from '@/components/Navigation';
import MobileNavigation from '@/components/MobileNavigation';

export default function HomePage() {
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [recentAnime, setRecentAnime] = useState<Anime[]>([]);
  const [ongoingAnime, setOngoingAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        // Fetch different categories of anime from our API
        const [popularRes, recentRes, ongoingRes] = await Promise.all([
          fetch('/api/anime/popular?page=1&limit=10'),
          fetch('/api/anime?sortBy=createdAt&order=desc&page=1&limit=10'),
          fetch('/api/anime?status=ONGOING&page=1&limit=10')
        ]);

        if (!popularRes.ok || !recentRes.ok || !ongoingRes.ok) {
          throw new Error('Failed to fetch anime data');
        }

        const [popular, recent, ongoing] = await Promise.all([
          popularRes.json(),
          recentRes.json(),
          ongoingRes.json()
        ]);

        setPopularAnime(popular.data || []);
        setRecentAnime(recent.data || []);
        setOngoingAnime(ongoing.data || []);
      } catch (err: any) {
        console.error('Failed to fetch anime data:', err);
        setError(err.response?.data?.message || 'Failed to load anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка аниме...</h2>
          <p className="text-gray-400">Подождите, мы загружаем лучшие аниме для вас</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-white mb-2">Ошибка загрузки</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="btn-crunchyroll"
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation />
      <MobileNavigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            CRUNCHYROLL
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Смотрите лучшие аниме онлайн в высоком качестве
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-lg">
            Начать просмотр
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-16 py-12">
        {/* Popular Anime Carousel */}
        <section>
          <AnimeCarousel
            title="Popular Right Now"
            items={popularAnime.map(anime => ({
              id: anime.id,
              title: anime.title,
              image: anime.image || '/placeholder-anime.jpg',
              rating: anime.rating,
              year: anime.releaseDate ? new Date(anime.releaseDate).getFullYear().toString() : undefined,
              episodes: anime.episodes,
              status: anime.status,
              genres: anime.genres.map(g => g.name),
              description: anime.description
            }))}
          />
        </section>

        {/* Ongoing Series Carousel */}
        <section>
          <AnimeCarousel
            title="Ongoing Series"
            items={ongoingAnime.map(anime => ({
              id: anime.id,
              title: anime.title,
              image: anime.image || '/placeholder-anime.jpg',
              rating: anime.rating,
              year: anime.releaseDate ? new Date(anime.releaseDate).getFullYear().toString() : undefined,
              episodes: anime.episodes,
              status: anime.status,
              genres: anime.genres.map(g => g.name),
              description: anime.description
            }))}
          />
        </section>

        {/* Recently Added Carousel */}
        <section>
          <AnimeCarousel
            title="Recently Added"
            items={recentAnime.map(anime => ({
              id: anime.id,
              title: anime.title,
              image: anime.image || '/placeholder-anime.jpg',
              rating: anime.rating,
              year: anime.releaseDate ? new Date(anime.releaseDate).getFullYear().toString() : undefined,
              episodes: anime.episodes,
              status: anime.status,
              genres: anime.genres.map(g => g.name),
              description: anime.description
            }))}
          />
        </section>
      </div>
    </div>
  );
}
