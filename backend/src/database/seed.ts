import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeders/seeder.module';
import { AnimeSeeder } from './seeders/anime.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  
  const animeSeeder = app.get(AnimeSeeder);
  
  try {
    console.log('🚀 Starting database seeding...');
    await animeSeeder.seedAll();
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
