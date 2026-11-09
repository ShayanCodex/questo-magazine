import { useState, useRef } from 'react';
import {
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Fallback video URL if primary video fails to load
  const fallbackVideoSrc = '/showcase-video.mp4';
  const [activeVideoSrc, setActiveVideoSrc] = useState(videoSrc);

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

  const handleVideoError = () => {
    if (activeVideoSrc !== fallbackVideoSrc) {
      setActiveVideoSrc(fallbackVideoSrc);
    } else {
      setVideoError(true);
    }
  };

  return (
    <section
      className="relative w-full my-8 sm:my-14 flex flex-col items-center"
      aria-label="Cinematic architectural video"
    >
      {/* Full-width Video Frame */}
      <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl border border-editorial-border bg-neutral-900 group aspect-[16/10] sm:aspect-[21/10] md:h-[68vh] md:max-h-[760px] md:min-h-[460px] md:aspect-auto">
        {/* Fallback Poster Background */}
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
            src={activeVideoSrc}
            poster={posterSrc}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={handleVideoError}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
          />
        )}

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />

        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 sm:p-8 lg:p-12 text-white pointer-events-none">
          {/* Top Bar - Controls Only (Tags completely removed) */}
          <div className="flex items-center justify-end pointer-events-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer shadow-md hover:scale-105"
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
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer shadow-md hover:scale-105"
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

          {/* Bottom Clean Typography (Metadata line and fullscreen progress removed) */}
          <div className="space-y-2 sm:space-y-3 max-w-3xl">
            <h3 className="font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white drop-shadow-xl leading-[1.05]">
              {title}
            </h3>

            <p className="font-serif text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed max-w-2xl drop-shadow-md">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Centered Editorial Statement Under Video */}
      <div className="pt-6 sm:pt-8 text-center max-w-2xl mx-auto px-4">
        <p className="font-sans text-editorial-muted text-xs sm:text-sm md:text-base leading-relaxed font-medium">
          Questo investigates the architectural dialogue between monumental mass, tactile stone, and contemplative acoustic silence across modern visual culture.
        </p>
      </div>
    </section>
  );
}
