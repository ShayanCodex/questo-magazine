import { useState, useEffect, useRef } from 'react';
import {
  FilmIcon,
  SparklesIcon,
  ArrowsPointingOutIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';

export interface CinematicScrollVideoProps {
  videoSrc?: string;
  posterSrc?: string;
  title?: string;
  subtitle?: string;
}

export function CinematicScrollVideo({
  videoSrc = 'https://vjs.zencdn.net/v/oceans.mp4',
  posterSrc = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90',
  title = 'The Geometry of Silence',
  subtitle = 'A visual exploration of brutalist mass, void space, and monumental architectural permanence.',
}: CinematicScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const totalDistance = rect.height - windowHeight;
        if (totalDistance <= 0) return;

        // Current distance scrolled into this section
        const scrolled = -rect.top;
        const rawProgress = scrolled / (totalDistance * 0.7);
        const clamped = Math.max(0, Math.min(1, rawProgress));
        setScrollProgress(clamped);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Interpolations based on scroll progress (0 -> 1)
  const widthPercent = 68 + scrollProgress * 32; // 68% -> 100%
  const heightVh = 56 + scrollProgress * 44; // 56vh -> 100vh
  const borderRadiusPx = Math.max(0, 20 * (1 - scrollProgress * 1.6)); // 20px -> 0px
  const headlineScale = 1 + scrollProgress * 0.35; // grows subtly as canvas expands

  return (
    <div
      ref={containerRef}
      className="relative min-h-[170vh] sm:min-h-[190vh] w-full my-8"
      aria-label="Cinematic architectural video expansion"
    >
      {/* Sticky container that stays pinned while expanding */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Intro Tag Header above Frame before fully expanded */}
        <div
          className="pb-3 text-center space-y-1 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 2.2) }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-editorial-muted flex items-center justify-center gap-2 font-medium">
            <FilmIcon className="h-3.5 w-3.5 text-editorial-text" />
            <span>Cinematic Visual Monograph</span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1 text-[11px] text-editorial-text">
              <ArrowsPointingOutIcon className="h-3 w-3" />
              <span>Scroll to Expand Fullscreen</span>
            </span>
          </span>
          <p className="font-display font-black text-lg sm:text-2xl uppercase tracking-tight text-editorial-text">
            Spatial Volume &amp; Architecture
          </p>
        </div>

        {/* Morphing Video / Visual Frame */}
        <div
          className="relative overflow-hidden transition-all duration-75 ease-out shadow-2xl border border-editorial-border bg-neutral-900 group"
          style={{
            width: `${widthPercent}%`,
            height: `${heightVh}vh`,
            borderRadius: `${borderRadiusPx}px`,
            maxWidth: scrollProgress >= 0.95 ? '100vw' : '1440px',
            willChange: 'width, height, border-radius',
          }}
        >
          {/* Fallback Poster Background (always visible as warm backdrop) */}
          <img
            src={posterSrc}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
            loading="eager"
          />

          {/* HTML5 Autoplaying Loop Video */}
          {!videoError && (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onError={() => setVideoError(true)}
              className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
            />
          )}

          {/* Cinematic Vignette Overlay (balanced, never pitch black) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />

          {/* Persistent Typography & Overlay Content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white pointer-events-none">
            {/* Top Bar inside Video Frame */}
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-black/60 backdrop-blur-md border border-white/20 font-mono text-xs uppercase tracking-widest text-white shadow-sm">
                  <SparklesIcon className="h-3.5 w-3.5 text-white" />
                  <span>Issue 03 Architectural Film</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-white/20 backdrop-blur-md border border-white/30 font-mono text-[11px] uppercase tracking-wider text-white">
                  4K Ultra-HD
                </span>
              </div>

              {/* Interactive Audio & Play/Pause Controls */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer shadow-md hover:scale-105"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? (
                    <PauseIcon className="h-4 w-4" />
                  ) : (
                    <PlayIcon className="h-4 w-4 fill-white" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer shadow-md hover:scale-105"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? (
                    <SpeakerXMarkIcon className="h-4 w-4" />
                  ) : (
                    <SpeakerWaveIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Hero Typography */}
            <div className="space-y-3 sm:space-y-4 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cinematic Exploration</span>
                <span className="opacity-40">•</span>
                <span>Autumn 2026</span>
              </div>

              <h3
                className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-white drop-shadow-xl leading-[1.05] transition-transform duration-100 ease-out origin-left"
                style={{ transform: `scale(${headlineScale})` }}
              >
                {title}
              </h3>

              <p className="font-serif text-xs sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-2xl drop-shadow-md">
                {subtitle}
              </p>

              {/* Expansion Status Indicator */}
              <div className="pt-1 flex items-center gap-3 text-xs font-mono text-white/70 uppercase tracking-wider">
                <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-75"
                    style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                  />
                </div>
                <span>
                  {scrollProgress >= 0.95 ? 'Fullscreen Active' : `${Math.round(scrollProgress * 100)}% Expanded`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
