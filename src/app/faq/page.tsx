import { HelpCircle, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import * as Accordion from '@radix-ui/react-accordion'

const faqData = [
  {
    id: 'what-is-animev',
    question: 'Что такое AnimeV?',
    answer: 'AnimeV - это современная платформа для просмотра аниме онлайн. Мы предоставляем доступ к огромной коллекции аниме сериалов и фильмов с русскими субтитрами в высоком качестве.'
  },
  {
    id: 'how-to-register',
    question: 'Как зарегистрироваться?',
    answer: 'Для регистрации нажмите кнопку "Войти" в правом верхнем углу, затем выберите "Зарегистрироваться". Заполните форму с вашим email, именем пользователя и паролем. После подтверждения email вы сможете пользоваться всеми функциями сайта.'
  },
  {
    id: 'free-or-paid',
    question: 'Сайт бесплатный?',
    answer: 'Да, AnimeV полностью бесплатен для использования. Мы предоставляем доступ ко всему контенту без платы. Регистрация также бесплатна и дает доступ к дополнительным функциям, таким как избранное и история просмотра.'
  },
  {
    id: 'video-quality',
    question: 'В каком качестве доступно видео?',
    answer: 'Мы предоставляем видео в различных качествах: 480p, 720p, 1080p и некоторые тайтлы в 4K. Качество автоматически адаптируется к скорости вашего интернет-соединения, но вы также можете выбрать качество вручную в настройках плеера.'
  },
  {
    id: 'subtitles',
    question: 'Есть ли русские субтитры?',
    answer: 'Да, все аниме на нашем сайте имеют качественные русские субтитры. Мы работаем с профессиональными переводчиками, чтобы обеспечить точный и читаемый перевод. Также доступны субтитры на других языках для некоторых тайтлов.'
  },
  {
    id: 'mobile-support',
    question: 'Работает ли сайт на мобильных устройствах?',
    answer: 'Да, AnimeV полностью адаптирован для мобильных устройств. Вы можете смотреть аниме на смартфонах и планшетах через браузер. Сайт автоматически подстраивается под размер экрана для удобного просмотра.'
  },
  {
    id: 'add-favorites',
    question: 'Как добавить аниме в избранное?',
    answer: 'Чтобы добавить аниме в избранное, нажмите на иконку сердечка на странице аниме или в карточке аниме. Для этого необходимо быть зарегистрированным пользователем. Все избранные аниме будут доступны в разделе "Избранное" в вашем профиле.'
  },
  {
    id: 'watch-history',
    question: 'Сохраняется ли прогресс просмотра?',
    answer: 'Да, для зарегистрированных пользователей автоматически сохраняется прогресс просмотра каждого эпизода. Вы можете продолжить просмотр с того места, где остановились. История просмотра доступна в соответствующем разделе профиля.'
  },
  {
    id: 'notifications',
    question: 'Как получать уведомления о новых эпизодах?',
    answer: 'Добавьте аниме в избранное или в список "Смотрю", и вы будете автоматически получать уведомления о выходе новых эпизодов. Уведомления отображаются на сайте, а также могут быть отправлены на email (настраивается в профиле).'
  },
  {
    id: 'search-filters',
    question: 'Как искать аниме по жанрам и годам?',
    answer: 'Используйте расширенный поиск с фильтрами. Нажмите кнопку "Фильтры" на странице поиска или каталога, где вы можете выбрать жанры, год выпуска, статус, тип аниме и другие параметры для точного поиска.'
  },
  {
    id: 'video-problems',
    question: 'Что делать, если видео не загружается?',
    answer: 'Попробуйте обновить страницу, проверить интернет-соединение, очистить кеш браузера или попробовать другой браузер. Если проблема сохраняется, сообщите нам через форму обратной связи с указанием названия аниме и эпизода.'
  },
  {
    id: 'report-issues',
    question: 'Как сообщить о проблеме или ошибке?',
    answer: 'Вы можете сообщить о проблемах через форму обратной связи в разделе "Контакты" или написать нам на email support@animev.ru. Укажите подробное описание проблемы, название аниме (если применимо) и используемый браузер.'
  }
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Часто задаваемые вопросы</h1>
          </div>
          <p className="text-muted-foreground">
            Найдите ответы на самые популярные вопросы о нашем сайте
          </p>
        </div>

        {/* FAQ Accordion */}
        <Card>
          <CardHeader>
            <CardTitle>Популярные вопросы</CardTitle>
            <CardDescription>
              Нажмите на вопрос, чтобы увидеть ответ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion.Root type="single" collapsible className="space-y-4">
              {faqData.map((item) => (
                <Accordion.Item
                  key={item.id}
                  value={item.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/50 transition-colors">
                    <span className="font-medium">{item.question}</span>
                    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                  <Accordion.Content className="px-4 pb-4 text-muted-foreground">
                    {item.answer}
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Не нашли ответ?</CardTitle>
            <CardDescription>
              Свяжитесь с нами, и мы поможем решить вашу проблему
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Email поддержки</h3>
                <p className="text-muted-foreground">support@animev.ru</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Время ответа</h3>
                <p className="text-muted-foreground">Обычно в течение 24 часов</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Полезные ссылки</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <a href="/terms" className="text-primary hover:underline">
                  Условия использования
                </a>
                <a href="/privacy" className="text-primary hover:underline">
                  Политика конфиденциальности
                </a>
                <a href="/contact" className="text-primary hover:underline">
                  Контакты
                </a>
                <a href="/help" className="text-primary hover:underline">
                  Справка
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'FAQ - AnimeV',
  description: 'Часто задаваемые вопросы о платформе AnimeV',
}
