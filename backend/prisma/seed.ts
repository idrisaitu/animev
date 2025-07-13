import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create genres
  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports',
    'Supernatural', 'Thriller', 'Mecha', 'School', 'Military'
  ];

  console.log('📚 Creating genres...');
  for (const genreName of genres) {
    await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName },
    });
  }

  // Create test users
  console.log('👥 Creating test users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      bio: 'Любитель аниме и манги',
      country: 'Russia',
      language: 'ru',
      theme: 'dark',
      emailVerified: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@animev.com' },
    update: {},
    create: {
      email: 'admin@animev.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      bio: 'Администратор AnimeV',
      country: 'Russia',
      language: 'ru',
      theme: 'dark',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  // Create anime data
  console.log('🎌 Creating anime...');
  const animeData = [
    {
      title: 'One Piece',
      originalTitle: 'One Piece',
      description: 'Monkey D. Luffy sets off on an adventure with his pirate crew in hopes of finding the greatest treasure ever, known as the "One Piece."',
      type: 'TV',
      status: 'ONGOING',
      rating: 9.0,
      episodes: 1000,
      duration: 24,
      image: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
      genres: ['Action', 'Adventure', 'Comedy', 'Drama'],
    },
    {
      title: 'Attack on Titan',
      originalTitle: 'Shingeki no Kyojin',
      description: 'Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction.',
      type: 'TV',
      status: 'COMPLETED',
      rating: 9.0,
      episodes: 75,
      duration: 24,
      image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
      genres: ['Action', 'Drama', 'Fantasy', 'Military'],
    },
    {
      title: 'Demon Slayer',
      originalTitle: 'Kimetsu no Yaiba',
      description: 'A young boy becomes a demon slayer to save his sister and avenge his family.',
      type: 'TV',
      status: 'ONGOING',
      rating: 8.7,
      episodes: 44,
      duration: 24,
      image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
      genres: ['Action', 'Supernatural', 'Drama'],
    },
    {
      title: 'My Hero Academia',
      originalTitle: 'Boku no Hero Academia',
      description: 'In a world where people with superpowers are the norm, a boy without powers dreams of becoming a hero.',
      type: 'TV',
      status: 'ONGOING',
      rating: 8.5,
      episodes: 138,
      duration: 24,
      image: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg',
      genres: ['Action', 'School', 'Supernatural'],
    },
    {
      title: 'Naruto',
      originalTitle: 'Naruto',
      description: 'A young ninja seeks recognition from his peers and dreams of becoming the Hokage.',
      type: 'TV',
      status: 'COMPLETED',
      rating: 8.3,
      episodes: 720,
      duration: 23,
      image: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
      genres: ['Action', 'Adventure', 'Comedy', 'Drama'],
    },
  ];

  for (const anime of animeData) {
    const createdAnime = await prisma.anime.create({
      data: {
        title: anime.title,
        originalTitle: anime.originalTitle,
        description: anime.description,
        type: anime.type,
        status: anime.status,
        rating: anime.rating,
        episodes: anime.episodes,
        duration: anime.duration,
        image: anime.image,
        genres: {
          connect: anime.genres.map(genreName => ({ name: genreName })),
        },
      },
    });

    console.log(`✅ Created anime: ${anime.title}`);
  }

  // Add some favorites for test user
  console.log('❤️ Adding favorites...');
  const allAnime = await prisma.anime.findMany();
  
  if (allAnime.length > 0) {
    await prisma.favorite.create({
      data: {
        userId: testUser.id,
        animeId: allAnime[0].id,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
