import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AnimeModule } from '../../anime/anime.module';
import { AnimeSeeder } from './anime.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AnimeModule,
  ],
  providers: [AnimeSeeder],
  exports: [AnimeSeeder],
})
export class SeederModule {}
