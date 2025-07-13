import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { AuthModule } from '../auth/auth.module';
import { SourceManager } from './source.manager';

@Module({
  imports: [AuthModule, CacheModule.register()],
  controllers: [StreamingController],
  providers: [StreamingService, SourceManager],
  exports: [StreamingService],
})
export class StreamingModule {}
