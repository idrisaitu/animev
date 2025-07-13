import { Anime } from '@/types/anime'

export const mockAnime: Anime[] = [
  {
    id: '1',
    title: 'Атака титанов',
    titleEnglish: 'Attack on Titan',
    titleJapanese: '進撃の巨人',
    description: 'Человечество живёт в городах, окружённых огромными стенами, защищающими их от гигантских гуманоидных существ, называемых титанами.',
    poster: 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Attack+on+Titan',
    banner: 'https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=Attack+on+Titan',
    year: 2013,
    status: 'completed',
    type: 'tv',
    episodes: 87,
    episodeDuration: 24,
    genres: ['Экшен', 'Драма', 'Фэнтези'],
    studios: ['Mappa', 'Studio Pierrot'],
    rating: 9.0,
    popularity: 95,
    aired: {
      from: '2013-04-07',
      to: '2023-11-04'
    },
    season: 'spring',
    source: 'Manga'
  },
  {
    id: '2',
    title: 'Демон-истребитель',
    titleEnglish: 'Demon Slayer',
    titleJapanese: '鬼滅の刃',
    description: 'Танджиро Камадо становится охотником на демонов, чтобы спасти свою сестру, превращённую в демона.',
    poster: 'https://via.placeholder.com/300x400/2d1b69/ffffff?text=Demon+Slayer',
    banner: 'https://via.placeholder.com/1200x600/2d1b69/ffffff?text=Demon+Slayer',
    year: 2019,
    status: 'ongoing',
    type: 'tv',
    episodes: 44,
    episodeDuration: 23,
    genres: ['Экшен', 'Сверхъестественное', 'Исторический'],
    studios: ['Ufotable'],
    rating: 8.7,
    popularity: 92,
    aired: {
      from: '2019-04-06'
    },
    season: 'spring',
    source: 'Manga'
  },
  {
    id: '3',
    title: 'Моя геройская академия',
    titleEnglish: 'My Hero Academia',
    titleJapanese: '僕のヒーローアカデミア',
    description: 'В мире, где большинство людей обладают сверхспособностями, Изуку Мидория мечтает стать героем.',
    poster: 'https://via.placeholder.com/300x400/4a90e2/ffffff?text=My+Hero+Academia',
    banner: 'https://via.placeholder.com/1200x600/4a90e2/ffffff?text=My+Hero+Academia',
    year: 2016,
    status: 'ongoing',
    type: 'tv',
    episodes: 138,
    episodeDuration: 24,
    genres: ['Экшен', 'Школа', 'Супергерои'],
    studios: ['Studio Bones'],
    rating: 8.5,
    popularity: 89,
    aired: {
      from: '2016-04-03'
    },
    season: 'spring',
    source: 'Manga'
  },
  {
    id: '4',
    title: 'Ван-Пис',
    titleEnglish: 'One Piece',
    titleJapanese: 'ワンピース',
    description: 'Монки Д. Луффи и его команда пиратов Соломенной Шляпы ищут легендарное сокровище Ван-Пис.',
    poster: 'https://via.placeholder.com/300x400/f39c12/ffffff?text=One+Piece',
    banner: 'https://via.placeholder.com/1200x600/f39c12/ffffff?text=One+Piece',
    year: 1999,
    status: 'ongoing',
    type: 'tv',
    episodes: 1000,
    episodeDuration: 24,
    genres: ['Экшен', 'Приключения', 'Комедия'],
    studios: ['Toei Animation'],
    rating: 9.1,
    popularity: 94,
    aired: {
      from: '1999-10-20'
    },
    season: 'fall',
    source: 'Manga'
  },
  {
    id: '5',
    title: 'Наруто',
    titleEnglish: 'Naruto',
    titleJapanese: 'ナルト',
    description: 'Наруто Узумаки мечтает стать Хокаге и получить признание жителей своей деревни.',
    poster: 'https://via.placeholder.com/300x400/e67e22/ffffff?text=Naruto',
    banner: 'https://via.placeholder.com/1200x600/e67e22/ffffff?text=Naruto',
    year: 2002,
    status: 'completed',
    type: 'tv',
    episodes: 720,
    episodeDuration: 23,
    genres: ['Экшен', 'Боевые искусства', 'Сверхъестественное'],
    studios: ['Studio Pierrot'],
    rating: 8.4,
    popularity: 91,
    aired: {
      from: '2002-10-03',
      to: '2017-03-23'
    },
    season: 'fall',
    source: 'Manga'
  },
  {
    id: '6',
    title: 'Магическая битва',
    titleEnglish: 'Jujutsu Kaisen',
    titleJapanese: '呪術廻戦',
    description: 'Юджи Итадори присоединяется к секретной организации магов, чтобы убить могущественное проклятие.',
    poster: 'https://via.placeholder.com/300x400/8e44ad/ffffff?text=Jujutsu+Kaisen',
    banner: 'https://via.placeholder.com/1200x600/8e44ad/ffffff?text=Jujutsu+Kaisen',
    year: 2020,
    status: 'ongoing',
    type: 'tv',
    episodes: 24,
    episodeDuration: 24,
    genres: ['Экшен', 'Сверхъестественное', 'Школа'],
    studios: ['Mappa'],
    rating: 8.6,
    popularity: 88,
    aired: {
      from: '2020-10-03'
    },
    season: 'fall',
    source: 'Manga'
  },
  {
    id: '7',
    title: 'Твоё имя',
    titleEnglish: 'Your Name',
    titleJapanese: '君の名は。',
    description: 'Два подростка из разных миров начинают меняться телами во сне.',
    poster: 'https://via.placeholder.com/300x400/e74c3c/ffffff?text=Your+Name',
    banner: 'https://via.placeholder.com/1200x600/e74c3c/ffffff?text=Your+Name',
    year: 2016,
    status: 'completed',
    type: 'movie',
    episodes: 1,
    episodeDuration: 106,
    genres: ['Романтика', 'Драма', 'Сверхъестественное'],
    studios: ['CoMix Wave Films'],
    rating: 8.4,
    popularity: 85,
    aired: {
      from: '2016-08-26',
      to: '2016-08-26'
    },
    season: 'summer',
    source: 'Original'
  },
  {
    id: '8',
    title: 'Унесённые призраками',
    titleEnglish: 'Spirited Away',
    titleJapanese: '千と千尋の神隠し',
    description: 'Девочка попадает в мир духов и должна найти способ спасти своих родителей.',
    poster: 'https://via.placeholder.com/300x400/27ae60/ffffff?text=Spirited+Away',
    banner: 'https://via.placeholder.com/1200x600/27ae60/ffffff?text=Spirited+Away',
    year: 2001,
    status: 'completed',
    type: 'movie',
    episodes: 1,
    episodeDuration: 125,
    genres: ['Приключения', 'Семейный', 'Фэнтези'],
    studios: ['Studio Ghibli'],
    rating: 9.3,
    popularity: 87,
    aired: {
      from: '2001-07-20',
      to: '2001-07-20'
    },
    season: 'summer',
    source: 'Original'
  }
]

export const featuredAnime = mockAnime.slice(0, 5)
export const popularAnime = mockAnime.slice(0, 8)
export const newAnime = mockAnime.slice(2, 8)
export const trendingAnime = mockAnime.slice(1, 7)
