'use client'

import { useState } from 'react'
import { History, Play, Clock, Calendar, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { mockAnime } from '@/lib/mock-data'
import { WatchHistoryItem } from '@/types/anime'
import { formatDate } from '@/lib/utils'

// Mock watch history data
const mockWatchHistory: (WatchHistoryItem & { anime: typeof mockAnime[0] })[] = [
  {
    animeId: '1',
    episodeId: '1-5',
    watchedAt: '2024-01-15T20:30:00Z',
    progress: 85,
    completed: false,
    anime: mockAnime[0]
  },
  {
    animeId: '2',
    episodeId: '2-12',
    watchedAt: '2024-01-14T19:15:00Z',
    progress: 100,
    completed: true,
    anime: mockAnime[1]
  },
  {
    animeId: '3',
    episodeId: '3-8',
    watchedAt: '2024-01-13T21:45:00Z',
    progress: 45,
    completed: false,
    anime: mockAnime[2]
  },
  {
    animeId: '4',
    episodeId: '4-156',
    watchedAt: '2024-01-12T18:20:00Z',
    progress: 100,
    completed: true,
    anime: mockAnime[3]
  },
  {
    animeId: '5',
    episodeId: '5-23',
    watchedAt: '2024-01-11T22:10:00Z',
    progress: 67,
    completed: false,
    anime: mockAnime[4]
  }
]

interface WatchHistoryProps {
  history?: typeof mockWatchHistory
}

export function WatchHistory({ history = mockWatchHistory }: WatchHistoryProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const clearSelected = () => {
    // Logic to remove selected items
    console.log('Removing items:', selectedItems)
    setSelectedItems([])
  }

  const clearAll = () => {
    // Logic to clear all history
    console.log('Clearing all history')
  }

  const getEpisodeNumber = (episodeId: string) => {
    return episodeId.split('-')[1] || '1'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">История просмотра</h1>
          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-sm">
            {history.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {selectedItems.length > 0 && (
            <Button variant="destructive" size="sm" onClick={clearSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить выбранные ({selectedItems.length})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={clearAll}>
            Очистить всё
          </Button>
        </div>
      </div>

      {/* Content */}
      {history.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold mb-2">История пуста</h3>
          <p className="text-muted-foreground mb-4">
            Начните смотреть аниме, чтобы здесь появилась история просмотра
          </p>
          <Button>
            Найти аниме
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={`${item.animeId}-${item.episodeId}`} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4 p-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(`${item.animeId}-${item.episodeId}`)}
                    onChange={() => toggleSelection(`${item.animeId}-${item.episodeId}`)}
                    className="rounded"
                  />

                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.anime.poster}
                      alt={item.anime.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {item.anime.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Эпизод {getEpisodeNumber(item.episodeId)}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Прогресс просмотра</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Watch Date */}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.watchedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(item.watchedAt).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {item.completed && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Просмотрено
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col space-y-2">
                    <Button size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      {item.completed ? 'Пересмотреть' : 'Продолжить'}
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      К аниме
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
