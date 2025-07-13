import { Calendar, Clock, Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockAnime } from '@/lib/mock-data'

// Mock schedule data
const scheduleData = [
  {
    day: 'Понедельник',
    anime: [
      { ...mockAnime[0], time: '19:00', episode: 6 },
      { ...mockAnime[1], time: '20:30', episode: 13 }
    ]
  },
  {
    day: 'Вторник',
    anime: [
      { ...mockAnime[2], time: '18:00', episode: 25 },
      { ...mockAnime[3], time: '21:00', episode: 1001 }
    ]
  },
  {
    day: 'Среда',
    anime: [
      { ...mockAnime[4], time: '19:30', episode: 721 },
      { ...mockAnime[5], time: '22:00', episode: 25 }
    ]
  },
  {
    day: 'Четверг',
    anime: [
      { ...mockAnime[0], time: '20:00', episode: 7 }
    ]
  },
  {
    day: 'Пятница',
    anime: [
      { ...mockAnime[1], time: '19:00', episode: 14 },
      { ...mockAnime[2], time: '21:30', episode: 26 }
    ]
  },
  {
    day: 'Суббота',
    anime: [
      { ...mockAnime[3], time: '18:30', episode: 1002 },
      { ...mockAnime[4], time: '20:00', episode: 722 },
      { ...mockAnime[5], time: '22:30', episode: 26 }
    ]
  },
  {
    day: 'Воскресенье',
    anime: [
      { ...mockAnime[0], time: '19:00', episode: 8 },
      { ...mockAnime[1], time: '21:00', episode: 15 }
    ]
  }
]

const currentDay = new Date().toLocaleDateString('ru-RU', { weekday: 'long' })
const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export default function SchedulePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Расписание выхода</h1>
          <p className="text-muted-foreground">
            Следите за выходом новых эпизодов ваших любимых аниме
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Сегодня: {capitalizeFirstLetter(currentDay)}</span>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {scheduleData.map((daySchedule) => (
            <Card 
              key={daySchedule.day} 
              className={`${
                capitalizeFirstLetter(currentDay) === daySchedule.day 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{daySchedule.day}</span>
                  {capitalizeFirstLetter(currentDay) === daySchedule.day && (
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                      Сегодня
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {daySchedule.anime.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Нет запланированных выходов
                  </p>
                ) : (
                  daySchedule.anime.map((anime, index) => (
                    <div
                      key={`${anime.id}-${index}`}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {/* Poster */}
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        className="w-12 h-16 object-cover rounded"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Эпизод {anime.episode}
                        </p>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{anime.time}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Releases */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Скоро выйдут</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAnime.slice(0, 6).map((anime) => (
              <Card key={anime.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-3 p-4">
                    <img
                      src={anime.poster}
                      alt={anime.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Следующий эпизод через 2 дня
                      </p>
                      <div className="flex items-center space-x-1 text-sm text-primary">
                        <Calendar className="h-3 w-3" />
                        <span>Среда, 20:00</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Time Zone Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Все времена указаны по московскому времени (UTC+3)</p>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Расписание выхода - AnimeV',
  description: 'Расписание выхода новых эпизодов аниме',
}
