import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { KodikService } from './providers/kodik.service';
import { SibnetService } from './providers/sibnet.service';

@Module({
  providers: [VideosService, KodikService, SibnetService],
  controllers: [VideosController],
  exports: [VideosService],
})
export class VideosModule {} 