'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Menu, User, Bell, Heart, History, Settings, LogOut, Play, Zap, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled
        ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center animate-glow">
                <Play className="h-5 w-5 text-white fill-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-gradient">AnimeV</span>
              <span className="text-xs text-muted-foreground -mt-1">ストリーミング</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 ml-12">
            <Link href="/" className="relative group">
              <span className="text-sm font-medium hover:text-primary transition-colors">
                Главная
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-blue-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/catalog" className="relative group">
              <span className="text-sm font-medium hover:text-primary transition-colors">
                Каталог
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-blue-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/search" className="relative group">
              <span className="text-sm font-medium hover:text-primary transition-colors">
                Поиск
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-blue-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/trending" className="relative group">
              <span className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Тренды
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-blue-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                <Input
                  type="search"
                  placeholder="Найти аниме, персонажей, жанры..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 bg-card/50 border-border/50 rounded-xl backdrop-blur-sm focus:bg-card focus:border-primary/50 transition-all duration-300"
                />
              </div>
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hover-lift relative group" asChild>
              <Link href="/favorites">
                <Heart className="h-5 w-5" />
                <div className="absolute inset-0 bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hover-lift relative group" asChild>
              <Link href="/history">
                <History className="h-5 w-5" />
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hover-lift relative group" asChild>
              <Link href="/profile">
                <User className="h-5 w-5" />
                <div className="absolute inset-0 bg-green-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover-lift"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl animate-slide-up">
          <nav className="container mx-auto px-4 py-6 space-y-3">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="h-2 w-2 bg-orange-500 rounded-full mr-3"></div>
              Главная
            </Link>
            <Link
              href="/catalog"
              className="flex items-center px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
              Каталог
            </Link>
            <Link
              href="/search"
              className="flex items-center px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="h-2 w-2 bg-purple-500 rounded-full mr-3"></div>
              Поиск
            </Link>
            <Link
              href="/trending"
              className="flex items-center px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="h-2 w-2 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
              Тренды
            </Link>
          </nav>
        </div>
      )}
      </div>
    </header>
  )
}
