'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Star, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface AnimeItem {
  id: string;
  title: string;
  image: string;
  rating?: number;
  year?: string;
  episodes?: number;
  status?: string;
  genres?: string[];
  description?: string;
}

interface AnimeCarouselProps {
  title: string;
  items: AnimeItem[];
  loading?: boolean;
}

export default function AnimeCarousel({ title, items, loading = false }: AnimeCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    }
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Демо данные если items пустой
  const demoItems: AnimeItem[] = [
    {
      id: 'demo-1',
      title: 'Attack on Titan',
      image: 'https://via.placeholder.com/300x400/FF6B35/FFFFFF?text=AOT',
      rating: 9.0,
      year: '2013',
      episodes: 87,
      status: 'Completed',
      genres: ['Action', 'Drama', 'Fantasy'],
      description: 'Humanity fights for survival against giant humanoid Titans.'
    },
    {
      id: 'demo-2',
      title: 'Demon Slayer',
      image: 'https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=Demon+Slayer',
      rating: 8.7,
      year: '2019',
      episodes: 44,
      status: 'Ongoing',
      genres: ['Action', 'Supernatural'],
      description: 'A young boy becomes a demon slayer to save his sister.'
    },
    {
      id: 'demo-3',
      title: 'One Piece',
      image: 'https://via.placeholder.com/300x400/45B7D1/FFFFFF?text=One+Piece',
      rating: 9.2,
      year: '1999',
      episodes: 1000,
      status: 'Ongoing',
      genres: ['Adventure', 'Comedy', 'Action'],
      description: 'Pirates search for the ultimate treasure, One Piece.'
    },
    {
      id: 'demo-4',
      title: 'Naruto',
      image: 'https://via.placeholder.com/300x400/96CEB4/FFFFFF?text=Naruto',
      rating: 8.4,
      year: '2002',
      episodes: 720,
      status: 'Completed',
      genres: ['Action', 'Adventure', 'Martial Arts'],
      description: 'A young ninja dreams of becoming the strongest leader.'
    },
    {
      id: 'demo-5',
      title: 'My Hero Academia',
      image: 'https://via.placeholder.com/300x400/FFEAA7/333333?text=MHA',
      rating: 8.5,
      year: '2016',
      episodes: 138,
      status: 'Ongoing',
      genres: ['Action', 'School', 'Superhero'],
      description: 'Students train to become professional superheroes.'
    }
  ];

  const displayItems = items.length > 0 ? items : demoItems;

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 rounded-lg aspect-[3/4] mb-3"></div>
              <div className="bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-700 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">{title}</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="h-10 w-10 p-0 bg-slate-800/50 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500 text-white transition-all duration-200 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="h-10 w-10 p-0 bg-slate-800/50 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500 text-white transition-all duration-200 rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {displayItems.map((anime, index) => (
            <motion.div
              key={anime.id}
              className="flex-none w-[280px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="anime-card group cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img
                      src={anime.image || '/placeholder-anime.jpg'}
                      alt={anime.title}
                      className="w-full h-[360px] object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <Button size="lg" className="btn-crunchyroll rounded-full shadow-2xl">
                        <Play className="h-6 w-6 ml-1" fill="currentColor" />
                      </Button>
                    </div>

                    {/* Status badge */}
                    {anime.status && (
                      <Badge 
                        variant={anime.status === 'Ongoing' ? 'default' : 'secondary'}
                        className="absolute top-3 right-3"
                      >
                        {anime.status}
                      </Badge>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-white mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors text-lg leading-tight">
                      {anime.title}
                    </h3>

                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                      {anime.rating && (
                        <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                          <span className="text-orange-400 font-semibold">{anime.rating}</span>
                        </div>
                      )}
                      {anime.year && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{anime.year}</span>
                        </div>
                      )}
                      {anime.episodes && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{anime.episodes} эп.</span>
                        </div>
                      )}
                    </div>

                    {anime.genres && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {anime.genres.slice(0, 3).map((genre) => (
                          <Badge key={genre} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {anime.description && (
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {anime.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
