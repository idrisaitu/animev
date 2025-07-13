import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockAnime } from '@/lib/mock-data'

// Extract unique genres from mock data
const genres = Array.from(
  new Set(mockAnime.flatMap(anime => anime.genres))
).sort()

// Count anime per genre
const genreStats = genres.map(genre => ({
  name: genre,
  count: mockAnime.filter(anime => anime.genres.includes(genre)).length,
  description: getGenreDescription(genre),
  color: getGenreColor(genre)
}))

function getGenreDescription(genre: string): string {
  const descriptions: Record<string, string> = {
    'Экшен': 'Динамичные сцены боя и приключений',
    'Приключения': 'Захватывающие путешествия и открытия',
    'Комедия': 'Юмор и смешные ситуации',
    'Драма': 'Эмоциональные и серьезные истории',
    'Фэнтези': 'Магия и фантастические миры',
    'Романтика': 'Любовные истории и отношения',
    'Научная фантастика': 'Технологии будущего и космос',
    'Триллер': 'Напряжение и неожиданные повороты',
    'Ужасы': 'Страшные и мистические элементы',
    'Мистика': 'Загадочные и необъяснимые явления',
    'Школа': 'Истории из школьной жизни',
    'Спорт': 'Спортивные соревнования и команды',
    'Музыка': 'Музыкальные темы и исполнители',
    'Исторический': 'События из прошлого',
    'Военный': 'Военные конфликты и сражения',
    'Сверхъестественное': 'Паранормальные способности',
    'Психологический': 'Глубокий анализ психики персонажей',
    'Боевые искусства': 'Мастерство единоборств'
  }
  return descriptions[genre] || 'Увлекательные истории в этом жанре'
}

function getGenreColor(genre: string): string {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500',
    'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-sky-500',
    'bg-slate-500', 'bg-gray-500'
  ]
  
  // Simple hash function to assign consistent colors
  let hash = 0
  for (let i = 0; i < genre.length; i++) {
    hash = genre.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export default function GenresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Жанры аниме</h1>
          <p className="text-muted-foreground">
            Найдите аниме по вашему любимому жанру
          </p>
        </div>

        {/* Genres Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {genreStats.map((genre) => (
            <Link key={genre.name} href={`/catalog?genres=${encodeURIComponent(genre.name)}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${genre.color}`} />
                    <CardTitle className="text-lg">{genre.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {genre.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {genre.count}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {genre.count === 1 ? 'аниме' : genre.count < 5 ? 'аниме' : 'аниме'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Popular Genres Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Популярные жанры</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {genreStats
              .sort((a, b) => b.count - a.count)
              .slice(0, 8)
              .map((genre) => (
                <Link
                  key={genre.name}
                  href={`/catalog?genres=${encodeURIComponent(genre.name)}`}
                  className="group"
                >
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 text-center hover:from-primary/20 hover:to-primary/10 transition-all duration-300">
                    <div className={`w-8 h-8 rounded-full ${genre.color} mx-auto mb-2`} />
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {genre.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {genre.count} аниме
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Жанры аниме - AnimeV',
  description: 'Исследуйте аниме по жанрам',
}
