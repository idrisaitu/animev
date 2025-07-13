'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SearchFilters } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { animes } from '@/lib/api'
import { AnimeFilter, Anime } from '@/types/anime'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState<AnimeFilter>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Anime[]>([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const performSearch = async () => {
    if (!query.trim()) {
      setResults([])
      setTotal(0)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchParams = {
        query: query.trim(),
        genres: filters.genres,
        year: filters.year,
        season: filters.season,
        status: filters.status,
        type: filters.type,
        rating: filters.rating ? filters.rating[0] : undefined,
        sort: filters.sort || 'rating',
        order: filters.order || 'desc',
        page: 1,
        limit: 20,
      }

      const response = await animes.getAll(searchParams)
      setResults(response.items)
      setTotal(response.total)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка поиска')
      setResults([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    performSearch()
  }

  const handleFiltersChange = (newFilters: AnimeFilter) => {
    setFilters(newFilters)
    if (query.trim()) {
      performSearch()
    }
  }

  const clearFilters = () => {
    setFilters({})
  }

  useEffect(() => {
    const initialQuery = searchParams.get('q')
    if (initialQuery) {
      setQuery(initialQuery)
      performSearch()
    }
  }, [searchParams])

  useEffect(() => {
    performSearch()
  }, [query, filters])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Поиск аниме</h1>
          <p className="text-muted-foreground">
            Найдите свое любимое аниме среди тысяч тайтлов
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="search"
              placeholder="Поиск по названию, жанру или описанию..."
              className="pl-10 pr-4 h-12 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(query)
                }
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
        />

        {/* Results */}
        <SearchResults
          anime={results}
          loading={loading}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          total={total}
          query={query}
          error={error}
        />
      </div>
    </div>
  )
}
