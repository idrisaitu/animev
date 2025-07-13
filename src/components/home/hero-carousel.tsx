'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Star } from 'lucide-react'
import type { Anime } from '@/types/anime'

interface HeroCarouselProps {
  items: Anime[]
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [items.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!items.length) return null

  const currentItem = items[currentIndex]

  return (
    <div className="hero-section">
      {/* Background Image */}
      <Image
        src={currentItem.image || 'https://cdn.myanimelist.net/images/anime/10/47347.jpg'}
        alt={currentItem.title}
        fill
        className="hero-image object-cover"
        priority
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://cdn.myanimelist.net/images/anime/10/47347.jpg';
        }}
      />
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content container mx-auto">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 text-primary">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium">{currentItem.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {currentItem.releaseDate ? new Date(currentItem.releaseDate).getFullYear() : 'N/A'}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{currentItem.type.toUpperCase()}</span>
            {currentItem.episodes > 0 && (
              <>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{currentItem.episodes} эп.</span>
              </>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentItem.title}
          </h1>
          
          {currentItem.description && (
            <p className="text-lg mb-6 line-clamp-3 text-muted-foreground">
              {currentItem.description}
            </p>
          )}
          
          <div className="flex items-center gap-4">
            <Link
              href={`/anime/${currentItem.id}`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition"
            >
              <Play className="h-5 w-5" />
              Смотреть
            </Link>
            <div className="flex flex-wrap gap-2">
              {currentItem.genres.slice(0, 3).map((genre) => (
                <Link
                  key={genre}
                  href={`/catalog?genres=${genre}`}
                  className="genre-tag hover:bg-secondary/80 transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-6'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
