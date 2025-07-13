import Link from 'next/link'
import { Github, Twitter, MessageCircle, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="anime-gradient h-8 w-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold">AnimeV</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Лучшая платформа для просмотра аниме онлайн. Смотрите любимые аниме в высоком качестве с русскими субтитрами.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Browse */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Обзор</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
                  Каталог аниме
                </Link>
              </li>
              <li>
                <Link href="/popular" className="text-muted-foreground hover:text-primary transition-colors">
                  Популярное
                </Link>
              </li>
              <li>
                <Link href="/new" className="text-muted-foreground hover:text-primary transition-colors">
                  Новинки
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-muted-foreground hover:text-primary transition-colors">
                  Расписание
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-muted-foreground hover:text-primary transition-colors">
                  Жанры
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Сообщество</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/forums" className="text-muted-foreground hover:text-primary transition-colors">
                  Форумы
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-muted-foreground hover:text-primary transition-colors">
                  Обзоры
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-muted-foreground hover:text-primary transition-colors">
                  Рекомендации
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                  Новости
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Поддержка</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Помощь
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Конфиденциальность
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 AnimeV. Все права защищены.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            Сделано с ❤️ для любителей аниме
          </p>
        </div>
      </div>
    </footer>
  )
}
