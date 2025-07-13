'use client'

import { useState } from 'react'
import { Bell, Check, Trash2, Settings, Play, Star, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Notification } from '@/types/anime'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'episode_release',
    title: 'Новый эпизод!',
    message: 'Вышел 6-й эпизод аниме "Атака титанов"',
    read: false,
    createdAt: '2024-01-15T10:30:00Z',
    data: { animeId: '1', episodeNumber: 6 }
  },
  {
    id: '2',
    type: 'anime_update',
    title: 'Обновление аниме',
    message: 'Добавлена информация о втором сезоне "Демон-истребитель"',
    read: false,
    createdAt: '2024-01-14T15:20:00Z',
    data: { animeId: '2' }
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Рекомендация для вас',
    message: 'На основе ваших предпочтений мы рекомендуем "Магическая битва"',
    read: true,
    createdAt: '2024-01-13T09:15:00Z',
    data: { animeId: '6' }
  },
  {
    id: '4',
    type: 'system',
    title: 'Обновление системы',
    message: 'Добавлены новые функции в плеер и улучшена производительность',
    read: true,
    createdAt: '2024-01-12T12:00:00Z',
    data: {}
  },
  {
    id: '5',
    type: 'episode_release',
    title: 'Новый эпизод!',
    message: 'Вышел 24-й эпизод аниме "Моя геройская академия"',
    read: true,
    createdAt: '2024-01-11T18:45:00Z',
    data: { animeId: '3', episodeNumber: 24 }
  }
]

interface NotificationsProps {
  notifications?: Notification[]
}

export function Notifications({ notifications = mockNotifications }: NotificationsProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })

  const toggleSelection = (notificationId: string) => {
    setSelectedItems(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const markAsRead = (notificationIds: string[]) => {
    // Logic to mark notifications as read
    console.log('Marking as read:', notificationIds)
  }

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    markAsRead(unreadIds)
  }

  const deleteSelected = () => {
    // Logic to delete selected notifications
    console.log('Deleting notifications:', selectedItems)
    setSelectedItems([])
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'episode_release':
        return <Play className="h-5 w-5 text-green-500" />
      case 'anime_update':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'recommendation':
        return <Star className="h-5 w-5 text-yellow-500" />
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Уведомления</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {selectedItems.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={() => markAsRead(selectedItems)}>
                <Check className="h-4 w-4 mr-2" />
                Прочитано
              </Button>
              <Button variant="destructive" size="sm" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            </>
          )}
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Прочитать все
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Все ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Непрочитанные ({unreadCount})
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('read')}
        >
          Прочитанные ({notifications.length - unreadCount})
        </Button>
      </div>

      {/* Content */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold mb-2">
            {filter === 'unread' ? 'Нет непрочитанных уведомлений' : 'Нет уведомлений'}
          </h3>
          <p className="text-muted-foreground">
            {filter === 'unread' 
              ? 'Все уведомления прочитаны!'
              : 'Уведомления будут появляться здесь'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "overflow-hidden transition-colors cursor-pointer",
                !notification.read && "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
              )}
            >
              <CardContent className="p-0">
                <div className="flex items-start space-x-4 p-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(notification.id)}
                    onChange={() => toggleSelection(notification.id)}
                    className="mt-1 rounded"
                  />

                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-medium",
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>

                    {/* Action buttons for specific notification types */}
                    {notification.type === 'episode_release' && (
                      <div className="mt-3">
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-2" />
                          Смотреть эпизод
                        </Button>
                      </div>
                    )}

                    {notification.type === 'recommendation' && (
                      <div className="mt-3">
                        <Button size="sm" variant="outline">
                          <Star className="h-3 w-3 mr-2" />
                          Посмотреть аниме
                        </Button>
                      </div>
                    )}
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
