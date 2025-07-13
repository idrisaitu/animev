import { Injectable, Logger } from '@nestjs/common';

export interface Source {
  name: string;
  priority: number;
  enabled: boolean;
}

@Injectable()
export class SourceManager {
  private readonly logger = new Logger(SourceManager.name);
  private sources: Source[] = [
    { name: 'gogoanime', priority: 1, enabled: true },
    { name: 'zoro', priority: 2, enabled: true },
    { name: 'animepahe', priority: 3, enabled: true },
    { name: '9anime', priority: 4, enabled: true },
    { name: 'crunchyroll', priority: 5, enabled: false }, // Disabled by default
  ];

  constructor() {
    this.sortSources();
  }

  private sortSources(): void {
    this.sources.sort((a, b) => a.priority - b.priority);
  }

  getSources(preferredSource?: string): string[] {
    const enabledSources = this.sources
      .filter(s => s.enabled)
      .map(s => s.name);

    if (preferredSource && enabledSources.includes(preferredSource)) {
      return [
        preferredSource,
        ...enabledSources.filter(s => s !== preferredSource),
      ];
    }

    return enabledSources;
  }

  reportFailure(sourceName: string): void {
    this.logger.warn(`Source [${sourceName}] failed. Temporarily lowering its priority.`);
    const source = this.sources.find(s => s.name === sourceName);
    if (source) {
      // Lower priority temporarily by moving it to the end of the list
      source.priority = (this.sources[this.sources.length - 1]?.priority || 0) + 1;
      this.sortSources();
    }
  }
}