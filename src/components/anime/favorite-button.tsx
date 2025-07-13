'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { animes, auth } from '@/lib/api'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  animeId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function FavoriteButton({ 
  animeId, 
  className, 
  size = 'md', 
  showText = false 
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated())
    if (auth.isAuthenticated()) {
      checkFavoriteStatus()
    }
  }, [animeId])

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await animes.getFavorites()
      setIsFavorite(favorites.items.some((anime: any) => anime.id === animeId))
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/login'
      return
    }

    setLoading(true)
    try {
      if (isFavorite) {
        await animes.removeFromFavorites(animeId)
        setIsFavorite(false)
      } else {
        await animes.addToFavorites(animeId)
        setIsFavorite(true)
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error)
      // Show error message to user
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={toggleFavorite}
        className={cn(
          'border-white/20 hover:border-orange-500/50 hover:bg-orange-500/10',
          !showText && sizeClasses[size],
          className
        )}
      >
        <Heart className={cn(iconSizes[size], 'text-gray-400')} />
        {showText && <span className="ml-2 text-gray-400">В избранное</span>}
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={toggleFavorite}
      disabled={loading}
      className={cn(
        'border-white/20 transition-all duration-200',
        isFavorite 
          ? 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20' 
          : 'hover:border-orange-500/50 hover:bg-orange-500/10',
        !showText && sizeClasses[size],
        className
      )}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          isFavorite 
            ? 'text-red-500 fill-red-500' 
            : 'text-gray-400 hover:text-orange-500'
        )} 
      />
      {showText && (
        <span className={cn(
          'ml-2 transition-colors duration-200',
          isFavorite ? 'text-red-500' : 'text-gray-400'
        )}>
          {isFavorite ? 'В избранном' : 'В избранное'}
        </span>
      )}
    </Button>
  )
}
