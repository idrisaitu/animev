import { Notifications } from '@/components/user/notifications'

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Notifications />
    </div>
  )
}

export const metadata = {
  title: 'Уведомления - AnimeV',
  description: 'Ваши уведомления',
}
