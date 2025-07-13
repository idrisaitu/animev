'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { User, Mail, Calendar, MapPin, Save, LogOut, Settings } from 'lucide-react'
import { users, auth } from '@/lib/api'
import Navigation from '@/components/Navigation'
import MobileNavigation from '@/components/MobileNavigation'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    country: '',
    birthDate: '',
    language: 'ru',
    theme: 'dark',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const checkAuth = () => {
      if (!auth.isAuthenticated()) {
        router.push('/login')
        return
      }
      loadProfile()
    }

    checkAuth()
  }, [router])

  const loadProfile = async () => {
    try {
      const profileData = await users.getProfile()
      setUser(profileData)
      setFormData({
        email: profileData.email || '',
        username: profileData.username || '',
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        bio: profileData.bio || '',
        country: profileData.country || '',
        birthDate: profileData.birthDate ? profileData.birthDate.split('T')[0] : '',
        language: profileData.language || 'ru',
        theme: profileData.theme || 'dark',
      })
    } catch (err: any) {
      setError('Ошибка загрузки профиля')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updatedUser = await users.updateProfile(formData)
      setUser(updatedUser)
      setSuccess('Профиль успешно обновлен')
      
      // Update user in localStorage
      const currentUser = auth.getCurrentUser()
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updatedUser }))
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка обновления профиля')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLogout = () => {
    auth.logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Загрузка профиля...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient">
      <Navigation />
      <MobileNavigation />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4">
            МОЙ <span className="text-gradient-orange">ПРОФИЛЬ</span>
          </h1>
          <p className="text-gray-300 text-xl">Управляйте своей учетной записью и настройками</p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-4"></div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <Card className="lg:col-span-1 card-crunchyroll shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-white">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.username || 'Пользователь'
              }
            </CardTitle>
            <CardDescription className="text-gray-400">
              {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-gray-400 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              Регистрация: {new Date(user?.createdAt).toLocaleDateString('ru-RU')}
            </div>
            {user?.country && (
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                {user.country}
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all duration-200 py-3"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2 card-crunchyroll shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-2xl font-bold">
              <Settings className="h-6 w-6 mr-3 text-orange-400" />
              Редактировать профиль
            </CardTitle>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-2"></div>
            <CardDescription className="text-gray-300 text-lg mt-4">
              Обновите информацию о себе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">Имя</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Фамилия</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Имя пользователя</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-white">Страна</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-white">Дата рождения</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">О себе</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  placeholder="Расскажите о себе..."
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="btn-crunchyroll w-full text-lg py-4"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
