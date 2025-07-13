'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Play, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Anime } from '@/types/anime';
import { cn } from '@/lib/utils';
import FavoriteButton from './favorite-button';

interface AnimeCardProps {
  anime: Anime;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
  className?: string;
}

export function AnimeCard({ anime, size = 'md', showInfo = true, className }: AnimeCardProps) {
  const router = useRouter();

  const cardSizes = {
    sm: 'w-36',
    md: 'w-44',
    lg: 'w-56'
  };

  const imageSizes = {
    sm: 'h-52',
    md: 'h-64',
    lg: 'h-80'
  };

  const handleWatchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Переход к первому эпизоду
    router.push(`/watch/${anime.id}/1`);
  };

  return (
    <Link href={`/anime/${anime.id}`} className={cn('block group', cardSizes[size], className)}>
      <Card className="anime-card h-full">
        <div className="relative overflow-hidden">
          {anime.image ? (
            <Image
              src={anime.image}
              alt={anime.title}
              width={300}
              height={450}
              className={cn('anime-card-image transition-all duration-300 group-hover:brightness-75', imageSizes[size])}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
          ) : (
            <div className={cn('bg-muted flex items-center justify-center text-muted-foreground', imageSizes[size])}>
              <span className="text-sm">No Image</span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-3 bg-white/10 hover:bg-white/20"
                  onClick={handleWatchClick}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Watch Now
                </Button>
                <div onClick={(e) => e.preventDefault()}>
                  <FavoriteButton
                    animeId={anime.id}
                    size="sm"
                    className="h-8 w-8 bg-white/10 hover:bg-white/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="status-badge flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            <span>{anime.rating.toFixed(1)}</span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-primary/90 text-primary-foreground">
            {anime.status === 'ONGOING' && 'Ongoing'}
            {anime.status === 'COMPLETED' && 'Completed'}
            {anime.status === 'UPCOMING' && 'Upcoming'}
            {anime.status === 'CANCELLED' && 'Cancelled'}
          </div>
        </div>

        {showInfo && (
          <CardContent className="p-3">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {anime.title}
            </h3>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{anime.releaseDate ? new Date(anime.releaseDate).getFullYear() : 'N/A'}</span>
              <span>{anime.episodes || 'N/A'} ep.</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {anime.genres?.slice(0, 2).map((genre) => (
                <span
                  key={genre.id}
                  className="genre-tag"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
