'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimeCard } from '@/components/anime/anime-card'
import { Anime } from '@/types/anime'

interface AnimeSectionProps {
  title: string
  anime: Anime[]
  viewAllHref?: string
  className?: string
}

export function AnimeSection({ title, anime, viewAllHref, className }: AnimeSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
      setTimeout(checkScrollButtons, 300)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
      setTimeout(checkScrollButtons, 300)
    }
  }

  if (!anime.length) return null

  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <div className="flex items-center space-x-2">
            {viewAllHref && (
              <Link href={viewAllHref}>
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  Смотреть все
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            
            {/* Navigation Buttons */}
            <div className="hidden md:flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className="h-10 w-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
                disabled={!canScrollRight}
                className="h-10 w-10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Anime Cards */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          onScroll={checkScrollButtons}
        >
          {anime.map((item) => (
            <div key={item.id} className="flex-shrink-0">
              <AnimeCard anime={item} size="md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
