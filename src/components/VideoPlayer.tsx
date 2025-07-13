'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  SkipBack, 
  SkipForward,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  onProgress?: (progress: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  startTime?: number;
  episode?: string;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  subtitles?: Array<{
    src: string;
    label: string;
    language: string;
  }>;
  className?: string;
}

interface StreamingSource {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export default function VideoPlayer({
  src,
  title,
  poster,
  onProgress,
  onEnded,
  autoPlay = false,
  startTime = 0,
  episode,
  onNextEpisode,
  onPrevEpisode,
  subtitles = [],
  className = ""
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('auto');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [availableSpeeds] = useState([0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('');
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Скрыть контролы через 3 секунды бездействия
  useEffect(() => {
    if (showControls && playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, playing]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!playerRef.current) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setPlaying(!playing);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          playerRef.current.seekTo(Math.max(0, played - 0.05), 'fraction');
          break;
        case 'ArrowRight':
          e.preventDefault();
          playerRef.current.seekTo(Math.min(1, played + 0.05), 'fraction');
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          e.preventDefault();
          setMuted(!muted);
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [playing, played, volume, muted]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const handleProgress = (state: any) => {
    if (!seeking) {
      setPlayed(state.played);
      setLoaded(state.loaded);
    }
    onProgress?.(state);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0] / 100);
  };

  const handleSeekMouseUp = (value: number[]) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(value[0] / 100, 'fraction');
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    setMuted(value[0] === 0);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer && internalPlayer.playbackRate !== undefined) {
        internalPlayer.playbackRate = speed;
      }
    }
  };

  const handleSubtitleChange = (subtitleSrc: string) => {
    setSelectedSubtitle(subtitleSrc);
    setShowSubtitles(subtitleSrc !== '');
  };

  const handleMiniPlayerToggle = () => {
    setShowMiniPlayer(!showMiniPlayer);
  };

  const handleNextEpisode = () => {
    onNextEpisode?.();
  };

  const handlePrevEpisode = () => {
    onPrevEpisode?.();
  };

  const skip = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      playerRef.current.seekTo(newTime, 'seconds');
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Episode Info Overlay */}
      {(title || episode) && showControls && (
        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
          {title && <h3 className="text-white font-semibold text-sm">{title}</h3>}
          {episode && <p className="text-gray-300 text-xs">{episode}</p>}
        </div>
      )}
      {/* Видеоплеер */}
      <ReactPlayer
        ref={playerRef}
        url={src}
        width="100%"
        height="100%"
        playing={playing}
        volume={muted ? 0 : volume}
        playbackRate={playbackSpeed}
        onProgress={handleProgress}
        onDuration={setDuration}
        onEnded={onEnded}
        onReady={() => {
          setLoading(false);
          if (startTime > 0 && playerRef.current) {
            playerRef.current.seekTo(startTime, 'seconds');
          }
        }}
        onError={(error) => {
          setError('Ошибка загрузки видео');
          setLoading(false);
        }}
        config={{
          file: {
            attributes: {
              poster: poster,
              crossOrigin: 'anonymous'
            },
            tracks: subtitles.map(subtitle => ({
              kind: 'subtitles',
              src: subtitle.src,
              srcLang: subtitle.language,
              label: subtitle.label,
              default: subtitle.src === selectedSubtitle
            }))
          }
        }}
      />

      {/* Custom Subtitles Overlay */}
      {showSubtitles && selectedSubtitle && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/80 text-white px-4 py-2 rounded text-center max-w-2xl">
            <span className="text-sm">Субтитры включены ({subtitles.find(s => s.src === selectedSubtitle)?.label})</span>
          </div>
        </div>
      )}

      {/* Загрузка */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <p className="text-lg mb-2">⚠️ {error}</p>
            <Button 
              onClick={() => {
                setError(null);
                setLoading(true);
              }}
              variant="outline"
            >
              Попробовать снова
            </Button>
          </div>
        </div>
      )}

      {/* Контролы */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Заголовок */}
        {title && (
          <div className="absolute top-4 left-4 right-4">
            <h3 className="text-white text-lg font-semibold truncate">{title}</h3>
          </div>
        )}

        {/* Центральная кнопка воспроизведения */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            variant="ghost"
            className="h-16 w-16 rounded-full bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setPlaying(!playing)}
          >
            {playing ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </Button>
        </div>

        {/* Нижние контролы */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Прогресс бар */}
          <div className="mb-4">
            <Slider
              value={[played * 100]}
              max={100}
              step={0.1}
              onValueChange={handleSeekChange}
              onPointerDown={handleSeekMouseDown}
              onPointerUp={(e) => handleSeekMouseUp([(e.target as any).value])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>{formatTime(played * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setPlaying(!playing)}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => skip(-10)}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => skip(10)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              {/* Episode Navigation */}
              {onPrevEpisode && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handlePrevEpisode}
                  title="Предыдущий эпизод"
                >
                  ⏮️
                </Button>
              )}

              {onNextEpisode && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleNextEpisode}
                  title="Следующий эпизод"
                >
                  ⏭️
                </Button>
              )}

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setMuted(!muted)}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <div className="w-20">
                  <Slider
                    value={[muted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* Quality Settings */}
                  <div className="px-2 py-1 text-xs font-semibold text-gray-400">Качество</div>
                  <DropdownMenuItem onClick={() => setQuality('auto')}>
                    {quality === 'auto' && '✓ '}Авто
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setQuality('1080p')}>
                    {quality === '1080p' && '✓ '}1080p
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setQuality('720p')}>
                    {quality === '720p' && '✓ '}720p
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setQuality('480p')}>
                    {quality === '480p' && '✓ '}480p
                  </DropdownMenuItem>

                  {/* Speed Settings */}
                  <div className="px-2 py-1 text-xs font-semibold text-gray-400 border-t mt-1 pt-2">Скорость</div>
                  {availableSpeeds.map(speed => (
                    <DropdownMenuItem key={speed} onClick={() => handleSpeedChange(speed)}>
                      {playbackSpeed === speed && '✓ '}{speed}x
                    </DropdownMenuItem>
                  ))}

                  {/* Subtitles */}
                  {subtitles.length > 0 && (
                    <>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-400 border-t mt-1 pt-2">Субтитры</div>
                      <DropdownMenuItem onClick={() => handleSubtitleChange('')}>
                        {!showSubtitles && '✓ '}Выключены
                      </DropdownMenuItem>
                      {subtitles.map(subtitle => (
                        <DropdownMenuItem key={subtitle.src} onClick={() => handleSubtitleChange(subtitle.src)}>
                          {selectedSubtitle === subtitle.src && '✓ '}{subtitle.label}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={handleMiniPlayerToggle}
                title="Мини-плеер"
              >
                📱
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
