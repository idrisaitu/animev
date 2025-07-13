'use client'

import { useState, useEffect } from 'react'
import { Heart, Grid, List, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimeCard } from '@/components/anime/anime-card'
import { animes } from '@/lib/api'
import { Anime } from '@/types/anime'
import { cn } from '@/lib/utils'

interface FavoritesListProps {
  favorites?: Anime[]
}

export function FavoritesList({ favorites: initialFavorites }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<Anime[]>(initialFavorites || [])
  const [loading, setLoading] = useState(!initialFavorites)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'added' | 'title' | 'rating' | 'year'>('added')

  useEffect(() => {
    if (!initialFavorites) {
      fetchFavorites()
    }
  }, [initialFavorites])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await animes.getFavorites()
      setFavorites(response.items)
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromFavorites = async (animeId: string) => {
    try {
      await animes.removeFromFavorites(animeId)
      setFavorites(prev => prev.filter(anime => anime.id !== animeId))
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
    }
  }

  const filteredFavorites = favorites.filter(anime =>
    anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    anime.titleEnglish?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'rating':
        return b.rating - a.rating
      case 'year':
        return b.year - a.year
      default:
        return 0 // Keep original order for 'added'
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка избранного...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold">Избранное</h1>
          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-sm">
            {favorites.length}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Поиск в избранном..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="added">По дате добавления</option>
            <option value="title">По названию</option>
            <option value="rating">По рейтингу</option>
            <option value="year">По году</option>
          </select>

          {/* View Mode */}
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {sortedFavorites.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery ? (
            <>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">
                Попробуйте изменить поисковый запрос
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-xl font-semibold mb-2">Избранное пусто</h3>
              <p className="text-muted-foreground mb-4">
                Добавьте аниме в избранное, чтобы они появились здесь
              </p>
              <Button>
                Найти аниме
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'
            : 'space-y-4'
        )}>
          {sortedFavorites.map((anime) => (
            viewMode === 'grid' ? (
              <div key={anime.id} className="relative group">
                <AnimeCard anime={anime} size="md" />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveFromFavorites(anime.id)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
            ) : (
              <FavoriteListItem
                key={anime.id}
                anime={anime}
                onRemove={() => handleRemoveFromFavorites(anime.id)}
              />
            )
          ))}
        </div>
      )}
    </div>
  )
}

function FavoriteListItem({ anime, onRemove }: { anime: Anime; onRemove: () => void }) {
  return (
    <div className="flex space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0">
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-16 h-20 object-cover rounded"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg line-clamp-1">{anime.title}</h3>
        {anime.titleEnglish && (
          <p className="text-sm text-muted-foreground line-clamp-1">{anime.titleEnglish}</p>
        )}
        
        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
          <span>{anime.year}</span>
          <span>•</span>
          <span>{anime.episodes} эп.</span>
          <span>•</span>
          <span className="capitalize">
            {anime.status === 'ongoing' && 'Онгоинг'}
            {anime.status === 'completed' && 'Завершён'}
            {anime.status === 'upcoming' && 'Анонс'}
            {anime.status === 'cancelled' && 'Отменён'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {anime.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex flex-col items-end justify-between">
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-yellow-500">★</span>
          <span>{anime.rating.toFixed(1)}</span>
        </div>
        
        <Button
          size="sm"
          variant="destructive"
          onClick={onRemove}
        >
          <Heart className="h-4 w-4 fill-current mr-2" />
          Удалить
        </Button>
      </div>
    </div>
  )
}
