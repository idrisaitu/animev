import { Module } from '@nestjs/common';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AnimeProviderService } from './providers/anime-provider.service';
import { MyAnimeListProvider } from './providers/mal.provider';

@Module({
  imports: [PrismaModule],
  controllers: [AnimeController],
  providers: [
    AnimeService,
    AnimeProviderService,
    MyAnimeListProvider,
  ],
  exports: [AnimeService],
})
export class AnimeModule {} 