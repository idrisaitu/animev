'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as Select from '@radix-ui/react-select'
import * as Slider from '@radix-ui/react-slider'
import { AnimeFilter } from '@/types/anime'

interface SearchFiltersProps {
  filters: AnimeFilter
  onFiltersChange: (filters: AnimeFilter) => void
  onClearFilters: () => void
}

const genres = [
  'Экшен', 'Приключения', 'Комедия', 'Драма', 'Фэнтези', 'Романтика',
  'Научная фантастика', 'Триллер', 'Ужасы', 'Мистика', 'Школа', 'Спорт',
  'Музыка', 'Исторический', 'Военный', 'Сверхъестественное', 'Психологический'
]

const years = Array.from({ length: 30 }, (_, i) => 2024 - i)
const seasons = ['winter', 'spring', 'summer', 'fall']
const statuses = ['ongoing', 'completed', 'upcoming', 'cancelled']
const types = ['tv', 'movie', 'ova', 'ona', 'special']
const sortOptions = ['popularity', 'rating', 'title', 'year', 'episodes']

export function SearchFilters({ filters, onFiltersChange, onClearFilters }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof AnimeFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleGenre = (genre: string) => {
    const currentGenres = filters.genres || []
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre]
    updateFilter('genres', newGenres)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined
  )

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Фильтры</span>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
              Активны
            </span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-2" />
            Очистить
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Фильтры поиска</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Genres */}
            <div>
              <h4 className="font-medium mb-3">Жанры</h4>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant={filters.genres?.includes(genre) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            {/* Year and Season */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-3">Год</h4>
                <Select.Root
                  value={filters.year?.toString()}
                  onValueChange={(value) => updateFilter('year', parseInt(value))}
                >
                  <Select.Trigger className="w-full px-3 py-2 border rounded-md">
                    <Select.Value placeholder="Выберите год" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                      <Select.Viewport>
                        {years.map((year) => (
                          <Select.Item
                            key={year}
                            value={year.toString()}
                            className="px-3 py-2 cursor-pointer hover:bg-accent"
                          >
                            <Select.ItemText>{year}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div>
                <h4 className="font-medium mb-3">Сезон</h4>
                <Select.Root
                  value={filters.season}
                  onValueChange={(value) => updateFilter('season', value)}
                >
                  <Select.Trigger className="w-full px-3 py-2 border rounded-md">
                    <Select.Value placeholder="Выберите сезон" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-popover border rounded-md shadow-lg">
                      <Select.Viewport>
                        <Select.Item value="winter" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Зима</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="spring" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Весна</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="summer" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Лето</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="fall" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Осень</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>

            {/* Status and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-3">Статус</h4>
                <Select.Root
                  value={filters.status}
                  onValueChange={(value) => updateFilter('status', value)}
                >
                  <Select.Trigger className="w-full px-3 py-2 border rounded-md">
                    <Select.Value placeholder="Выберите статус" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-popover border rounded-md shadow-lg">
                      <Select.Viewport>
                        <Select.Item value="ongoing" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Онгоинг</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="completed" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Завершён</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="upcoming" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Анонс</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="cancelled" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Отменён</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div>
                <h4 className="font-medium mb-3">Тип</h4>
                <Select.Root
                  value={filters.type}
                  onValueChange={(value) => updateFilter('type', value)}
                >
                  <Select.Trigger className="w-full px-3 py-2 border rounded-md">
                    <Select.Value placeholder="Выберите тип" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-popover border rounded-md shadow-lg">
                      <Select.Viewport>
                        <Select.Item value="tv" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>TV Сериал</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="movie" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Фильм</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="ova" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>OVA</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="ona" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>ONA</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="special" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Спешл</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>

            {/* Rating Range */}
            <div>
              <h4 className="font-medium mb-3">Рейтинг</h4>
              <div className="px-3">
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={filters.rating || [0, 10]}
                  onValueChange={(value) => updateFilter('rating', value as [number, number])}
                  max={10}
                  min={0}
                  step={0.1}
                >
                  <Slider.Track className="bg-muted relative grow rounded-full h-[3px]">
                    <Slider.Range className="absolute bg-primary rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-primary rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary" />
                  <Slider.Thumb className="block w-5 h-5 bg-primary rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary" />
                </Slider.Root>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{filters.rating?.[0]?.toFixed(1) || '0.0'}</span>
                  <span>{filters.rating?.[1]?.toFixed(1) || '10.0'}</span>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <h4 className="font-medium mb-3">Сортировка</h4>
              <div className="flex space-x-2">
                <Select.Root
                  value={filters.sort}
                  onValueChange={(value) => updateFilter('sort', value)}
                >
                  <Select.Trigger className="flex-1 px-3 py-2 border rounded-md">
                    <Select.Value placeholder="Сортировать по" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-popover border rounded-md shadow-lg">
                      <Select.Viewport>
                        <Select.Item value="popularity" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Популярности</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="rating" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Рейтингу</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="title" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Названию</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="year" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Году</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="episodes" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>Количеству эпизодов</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                
                <Select.Root
                  value={filters.order}
                  onValueChange={(value) => updateFilter('order', value)}
                >
                  <Select.Trigger className="px-3 py-2 border rounded-md">
                    <Select.Value placeholder="Порядок" />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-popover border rounded-md shadow-lg">
                      <Select.Viewport>
                        <Select.Item value="desc" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>По убыванию</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="asc" className="px-3 py-2 cursor-pointer hover:bg-accent">
                          <Select.ItemText>По возрастанию</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
