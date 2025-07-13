import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AnimeModule } from './anime/anime.module';
import { VideosModule } from './videos/videos.module';
import { SearchModule } from './search/search.module';
import { StreamingModule } from './streaming/streaming.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    AnimeModule,
    VideosModule,
    SearchModule,
    StreamingModule,
  ],
})
export class AppModule {} 