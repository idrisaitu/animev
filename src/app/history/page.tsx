import { WatchHistory } from '@/components/user/watch-history'

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <WatchHistory />
    </div>
  )
}

export const metadata = {
  title: 'История просмотра - AnimeV',
  description: 'Ваша история просмотра аниме',
}
