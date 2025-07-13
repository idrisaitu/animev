'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimeCard } from '@/components/anime/anime-card'
import { animes, auth } from '@/lib/api'
import { Anime } from '@/types/anime'

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkAuth = () => {
      if (!auth.isAuthenticated()) {
        router.push('/login')
        return
      }
      loadFavorites()
    }

    checkAuth()
  }, [router])

  const loadFavorites = async () => {
    try {
      const response = await animes.getFavorites()
      setFavorites(response.items || [])
    } catch (err: any) {
      setError('Ошибка загрузки избранного')
      console.error('Error loading favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Загрузка избранного...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Heart className="h-8 w-8 mr-3 text-red-500 fill-red-500" />
              Избранное
            </h1>
            <p className="text-gray-400">
              {favorites.length > 0
                ? `У вас ${favorites.length} аниме в избранном`
                : 'У вас пока нет избранных аниме'
              }
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Card className="mb-8 bg-red-500/10 border-red-500/20">
          <CardContent className="p-4">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {favorites.length === 0 ? (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardHeader className="text-center py-12">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-16 w-16 text-gray-600" />
            </div>
            <CardTitle className="text-white text-xl mb-2">
              Ваше избранное пусто
            </CardTitle>
            <CardDescription className="text-gray-400 max-w-md mx-auto">
              Добавляйте аниме в избранное, нажимая на иконку сердечка на карточках аниме.
              Так вы сможете быстро найти свои любимые тайтлы.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-12">
            <Button
              onClick={() => router.push('/catalog')}
              className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white"
            >
              Перейти к каталогу
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((anime) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              size="md"
              showInfo={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
