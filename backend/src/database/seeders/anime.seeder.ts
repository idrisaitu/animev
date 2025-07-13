import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AnimeService } from '../../anime/anime.service';

@Injectable()
export class AnimeSeeder {
  constructor(
    private readonly prisma: PrismaService,
    private readonly animeService: AnimeService,
  ) {}

  async seedPopularAnime() {
    console.log('🌱 Starting to seed popular anime...');

    // List of popular anime to fetch
    const popularAnimeQueries = [
      'Attack on Titan',
      'Demon Slayer',
      'One Piece',
      'Naruto',
      'Dragon Ball',
      'My Hero Academia',
      'Jujutsu Kaisen',
      'Death Note',
      'One Punch Man',
      'Fullmetal Alchemist',
      'Tokyo Ghoul',
      'Hunter x Hunter',
      'Bleach',
      'Mob Psycho 100',
      'Chainsaw Man',
      'Spy x Family',
      'Cyberpunk Edgerunners',
      'Violet Evergarden',
      'Your Name',
      'Spirited Away',
      'Princess Mononoke',
      'Akira',
      'Ghost in the Shell',
      'Cowboy Bebop',
      'Neon Genesis Evangelion',
      'Studio Ghibli',
      'Makoto Shinkai',
      'Hayao Miyazaki',
      'Kimetsu no Yaiba',
      'Shingeki no Kyojin'
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const query of popularAnimeQueries) {
      try {
        console.log(`🔍 Fetching anime for query: ${query}`);
        
        const results = await this.animeService.findAll({
          query,
          limit: 5,
          page: 1,
        });

        if (results.items && results.items.length > 0) {
          for (const anime of results.items) {
            try {
              // Check if anime already exists
              const existing = await this.prisma.anime.findFirst({
                where: {
                  OR: [
                    { malId: anime.malId },
                    { title: anime.title },
                  ],
                },
              });

              if (!existing) {
                // Create genres first
                const genreNames = (anime as any).genres || [];
                const genres = [];

                for (const genreName of genreNames) {
                  if (typeof genreName === 'string') {
                    let genre = await this.prisma.genre.findUnique({
                      where: { name: genreName },
                    });

                    if (!genre) {
                      genre = await this.prisma.genre.create({
                        data: { name: genreName },
                      });
                    }
                    genres.push(genre);
                  }
                }

                // Create anime
                const createdAnime = await this.prisma.anime.create({
                  data: {
                    malId: anime.malId,
                    title: anime.title,
                    originalTitle: anime.originalTitle,
                    description: anime.description,
                    image: anime.image,
                    type: anime.type || 'TV',
                    status: anime.status || 'FINISHED',
                    releaseDate: anime.releaseDate,
                    rating: anime.rating || 0,
                    episodes: anime.episodes || 12,
                    duration: anime.duration || 24,
                    genres: {
                      connect: genres.map(g => ({ id: g.id })),
                    },
                  },
                });

                console.log(`✅ Added anime: ${createdAnime.title}`);
                successCount++;
              } else {
                console.log(`⏭️  Anime already exists: ${anime.title}`);
              }
            } catch (animeError) {
              console.error(`❌ Error adding anime ${anime.title}:`, animeError.message);
              errorCount++;
            }
          }
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (queryError) {
        console.error(`❌ Error fetching for query ${query}:`, queryError.message);
        errorCount++;
      }
    }

    console.log(`🎉 Seeding completed! Added: ${successCount}, Errors: ${errorCount}`);
    return { successCount, errorCount };
  }

  async seedGenres() {
    console.log('🌱 Seeding genres...');

    const genres = [
      'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
      'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports',
      'Supernatural', 'Thriller', 'Mecha', 'Historical', 'Military',
      'School', 'Shounen', 'Shoujo', 'Seinen', 'Josei', 'Isekai',
      'Magic', 'Demons', 'Vampires', 'Martial Arts', 'Music',
      'Psychological', 'Ecchi', 'Harem', 'Yaoi', 'Yuri'
    ];

    for (const genreName of genres) {
      try {
        await this.prisma.genre.upsert({
          where: { name: genreName },
          update: {},
          create: { name: genreName },
        });
      } catch (error) {
        console.error(`Error creating genre ${genreName}:`, error.message);
      }
    }

    console.log(`✅ Seeded ${genres.length} genres`);
  }

  async seedAll() {
    await this.seedGenres();
    await this.seedPopularAnime();
  }
}
