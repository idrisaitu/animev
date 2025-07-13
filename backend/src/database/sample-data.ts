import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleAnime = [
  {
    malId: '16498',
    title: 'Attack on Titan',
    originalTitle: 'Shingeki no Kyojin',
    description: 'Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction.',
    image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    type: 'TV',
    status: 'FINISHED',
    rating: 9.0,
    episodes: 25,
    duration: 24,
    genres: ['Action', 'Drama', 'Fantasy', 'Shounen']
  },
  {
    malId: '44511',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    originalTitle: 'Kimetsu no Yaiba',
    description: 'A young boy becomes a demon slayer to save his sister and avenge his family.',
    image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    type: 'TV',
    status: 'FINISHED',
    rating: 8.7,
    episodes: 26,
    duration: 24,
    genres: ['Action', 'Supernatural', 'Historical', 'Shounen']
  },
  {
    malId: '21',
    title: 'One Piece',
    originalTitle: 'One Piece',
    description: 'Monkey D. Luffy sets off on an adventure with his pirate crew in hopes of finding the greatest treasure ever, known as the "One Piece."',
    image: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
    type: 'TV',
    status: 'ONGOING',
    rating: 9.1,
    episodes: 1000,
    duration: 24,
    genres: ['Action', 'Adventure', 'Comedy', 'Shounen']
  },
  {
    malId: '20',
    title: 'Naruto',
    originalTitle: 'Naruto',
    description: 'Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage.',
    image: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
    type: 'TV',
    status: 'FINISHED',
    rating: 8.3,
    episodes: 220,
    duration: 23,
    genres: ['Action', 'Martial Arts', 'Comedy', 'Shounen']
  },
  {
    malId: '38000',
    title: 'Demon Slayer: Mugen Train',
    originalTitle: 'Kimetsu no Yaiba Movie: Mugen Ressha-hen',
    description: 'Tanjiro and the group have completed their rehabilitation training and head to their next mission.',
    image: 'https://cdn.myanimelist.net/images/anime/1704/106947.jpg',
    type: 'MOVIE',
    status: 'FINISHED',
    rating: 8.7,
    episodes: 1,
    duration: 117,
    genres: ['Action', 'Supernatural', 'Historical', 'Shounen']
  },
  {
    malId: '40748',
    title: 'Jujutsu Kaisen',
    originalTitle: 'Jujutsu Kaisen',
    description: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself.',
    image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    type: 'TV',
    status: 'FINISHED',
    rating: 8.5,
    episodes: 24,
    duration: 24,
    genres: ['Action', 'School', 'Supernatural', 'Shounen']
  },
  {
    malId: '1535',
    title: 'Death Note',
    originalTitle: 'Death Note',
    description: 'A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name in it.',
    image: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
    type: 'TV',
    status: 'FINISHED',
    rating: 9.0,
    episodes: 37,
    duration: 23,
    genres: ['Supernatural', 'Thriller', 'Psychological', 'Shounen']
  },
  {
    malId: '30276',
    title: 'One Punch Man',
    originalTitle: 'One Punch Man',
    description: 'The story of Saitama, a hero who can defeat any enemy with a single punch but struggles with mundane problems.',
    image: 'https://cdn.myanimelist.net/images/anime/12/76049.jpg',
    type: 'TV',
    status: 'FINISHED',
    rating: 8.7,
    episodes: 12,
    duration: 24,
    genres: ['Action', 'Comedy', 'Superhero', 'Seinen']
  },
  {
    malId: '5114',
    title: 'Fullmetal Alchemist: Brotherhood',
    originalTitle: 'Hagane no Renkinjutsushi: Fullmetal Alchemist',
    description: 'Two brothers search for the Philosopher\'s Stone to restore their bodies after a failed alchemical ritual.',
    image: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
    type: 'TV',
    status: 'FINISHED',
    rating: 9.1,
    episodes: 64,
    duration: 24,
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy', 'Military', 'Shounen']
  },
  {
    malId: '50265',
    title: 'Spy x Family',
    originalTitle: 'Spy x Family',
    description: 'A spy must create a fake family to complete a mission, not knowing his wife is an assassin and his daughter is a telepath.',
    image: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg',
    type: 'TV',
    status: 'FINISHED',
    rating: 8.5,
    episodes: 12,
    duration: 24,
    genres: ['Action', 'Comedy', 'Family', 'Shounen']
  }
];

async function seedDatabase() {
  console.log('🌱 Starting to seed database with sample anime...');

  try {
    // First, create genres
    const allGenres = [...new Set(sampleAnime.flatMap(anime => anime.genres))];
    
    for (const genreName of allGenres) {
      await prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: { name: genreName },
      });
    }
    
    console.log(`✅ Created ${allGenres.length} genres`);

    // Then create anime
    for (const animeData of sampleAnime) {
      try {
        // Check if anime already exists
        const existing = await prisma.anime.findFirst({
          where: {
            OR: [
              { malId: animeData.malId },
              { title: animeData.title },
            ],
          },
        });

        if (!existing) {
          // Get genre IDs
          const genres = await prisma.genre.findMany({
            where: {
              name: {
                in: animeData.genres,
              },
            },
          });

          const anime = await prisma.anime.create({
            data: {
              malId: animeData.malId,
              title: animeData.title,
              originalTitle: animeData.originalTitle,
              description: animeData.description,
              image: animeData.image,
              type: animeData.type,
              status: animeData.status,
              rating: animeData.rating,
              episodes: animeData.episodes,
              duration: animeData.duration,
              releaseDate: new Date(),
              genres: {
                connect: genres.map(g => ({ id: g.id })),
              },
            },
          });

          console.log(`✅ Added anime: ${anime.title}`);
        } else {
          console.log(`⏭️  Anime already exists: ${animeData.title}`);
        }
      } catch (error) {
        console.error(`❌ Error adding anime ${animeData.title}:`, error.message);
      }
    }

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
