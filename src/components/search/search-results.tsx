import { Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimeCard } from '@/components/anime/anime-card'
import { Anime } from '@/types/anime'
import { cn } from '@/lib/utils'

interface SearchResultsProps {
  anime: Anime[]
  loading?: boolean
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  total?: number
  query?: string
}

export function SearchResults({ 
  anime, 
  loading = false, 
  viewMode, 
  onViewModeChange, 
  total = 0,
  query 
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="flex space-x-2">
            <div className="h-10 w-10 bg-muted rounded animate-pulse" />
            <div className="h-10 w-10 bg-muted rounded animate-pulse" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[3/4] bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {query ? `Результаты поиска для "${query}"` : 'Результаты поиска'}
          </h2>
          <p className="text-muted-foreground">
            Найдено {total} {total === 1 ? 'результат' : total < 5 ? 'результата' : 'результатов'}
          </p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results */}
      {anime.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры поиска или фильтры
          </p>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'
            : 'space-y-4'
        )}>
          {anime.map((item) => (
            viewMode === 'grid' ? (
              <AnimeCard key={item.id} anime={item} size="md" />
            ) : (
              <AnimeListItem key={item.id} anime={item} />
            )
          ))}
        </div>
      )}
    </div>
  )
}

function AnimeListItem({ anime }: { anime: Anime }) {
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
        
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {anime.description}
        </p>
      </div>
      
      <div className="flex-shrink-0 text-right">
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-yellow-500">★</span>
          <span>{anime.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}
