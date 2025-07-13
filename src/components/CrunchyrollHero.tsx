'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, Star, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FavoriteButton from '@/components/FavoriteButton';
import type { Anime } from '@/types/anime';

interface CrunchyrollHeroProps {
  animes: Anime[];
}

export default function CrunchyrollHero({ animes }: CrunchyrollHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  if (!animes || animes.length === 0) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center bg-gray-900">
        <p className="text-white">Loading slides...</p>
      </div>
    );
  }

  const currentAnime = animes[currentSlide];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % animes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, animes.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % animes.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + animes.length) % animes.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const year = currentAnime.releaseDate ? new Date(currentAnime.releaseDate).getFullYear().toString() : 'N/A';

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentAnime.image || '/placeholder-anime.jpg'})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="space-y-6"
                >
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-3 py-1">
                      {currentAnime.status}
                    </Badge>
                    <Badge variant="outline" className="border-orange-500 text-orange-400">
                      {year}
                    </Badge>
                    <Badge variant="outline" className="border-orange-500 text-orange-400">
                      {currentAnime.episodes} episodes
                    </Badge>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                    {currentAnime.title}
                  </h1>

                  {/* Rating and Info */}
                  <div className="flex items-center gap-6 text-white">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
                      <span className="text-xl font-bold">{currentAnime.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-300" />
                      <span className="text-gray-300">{year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-300" />
                      <span className="text-gray-300">{currentAnime.episodes} ep.</span>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2">
                    {currentAnime.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-lg text-gray-200 leading-relaxed max-w-2xl line-clamp-3">
                    {currentAnime.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Button className="btn-crunchyroll text-lg px-8 py-4">
                      <Play className="h-5 w-5 mr-2" fill="currentColor" />
                      Watch Now
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4">
                      <Info className="h-5 w-5 mr-2" />
                      More Info
                    </Button>
                    <FavoriteButton anime={{...currentAnime, image: currentAnime.image || '', genres: currentAnime.genres.map(g => g.name)}} />
                  </div>
                </motion.div>

                {/* Anime Poster */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="hidden lg:flex justify-center"
                >
                  <div className="relative group">
                    <img
                      src={currentAnime.image || '/placeholder-anime.jpg'}
                      alt={currentAnime.title}
                      className="w-80 h-auto rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="lg"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12 p-0"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="lg"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12 p-0"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {animes.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-orange-500 w-8'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 8, ease: 'linear' }}
          key={currentSlide}
        />
      </div>
    </div>
  );
}
