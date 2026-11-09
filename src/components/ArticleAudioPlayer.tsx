import { useState, useEffect, useRef } from 'react';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline';
import type { ArticleData } from '../lib/types';
import { cn } from '../lib/utils';

export interface ArticleAudioPlayerProps {
  article: ArticleData;
  langCode?: string;
  className?: string;
}

const PLAYBACK_RATES = [1.0, 1.25, 1.5];

export function ArticleAudioPlayer({
  article,
  langCode = 'en',
  className,
}: ArticleAudioPlayerProps) {
  const [supported, setSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rateIndex, setRateIndex] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentRate = PLAYBACK_RATES[rateIndex];

  // Extract clean text to speak
  const extractText = () => {
    const parts: string[] = [];
    if (article.title) parts.push(article.title);
    if (article.excerpt) parts.push(article.excerpt);
    if (Array.isArray(article.body)) {
      for (const block of article.body) {
        if (['p', 'h2', 'h3'].includes(block.type) && block.text) {
          parts.push(block.text);
        } else if (block.type === 'quote' && block.text) {
          parts.push(block.text);
        }
      }
    }
    return parts.join('. ');
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const selectVoiceForLanguage = (synth: SpeechSynthesis, targetLang: string) => {
    const voices = synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // Direct match e.g. "en-US", "es-ES"
    const directMatch = voices.find((v) =>
      v.lang.toLowerCase().startsWith(targetLang.toLowerCase())
    );
    return directMatch || voices[0];
  };

  const handlePlay = () => {
    if (!supported || typeof window === 'undefined') return;

    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    synth.cancel();

    const fullText = extractText();
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = currentRate;

    // Pick localized voice
    const matchedVoice = selectVoiceForLanguage(synth, langCode);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = langCode;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const handlePause = () => {
    if (!supported || typeof window === 'undefined') return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!supported || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const cycleRate = () => {
    const nextIndex = (rateIndex + 1) % PLAYBACK_RATES.length;
    setRateIndex(nextIndex);

    if (isPlaying && utteranceRef.current) {
      // SpeechSynthesis doesn't update rate live, restart cleanly at rate
      handlePlay();
    }
  };

  if (!supported) return null;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 p-1.5 pe-3.5 rounded-full border border-editorial-border bg-editorial-surface shadow-2xs text-editorial-text transition-all',
        isPlaying && 'border-editorial-text ring-1 ring-editorial-text/20',
        className
      )}
      role="region"
      aria-label="Audio article narration player"
    >
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={isPlaying ? handlePause : handlePlay}
        className="w-8 h-8 rounded-full bg-editorial-text text-editorial-bg flex items-center justify-center hover:opacity-90 transition-all cursor-pointer shadow-xs shrink-0"
        title={isPlaying ? 'Pause audio narration' : 'Listen to this article'}
        aria-label={isPlaying ? 'Pause narration' : 'Listen to this article'}
      >
        {isPlaying ? (
          <PauseIcon className="h-4 w-4" />
        ) : (
          <PlayIcon className="h-4 w-4 fill-editorial-bg translate-x-0.5" />
        )}
      </button>

      {/* Title & Status */}
      <div className="flex items-center gap-2 text-xs font-sans font-medium">
        <span className="flex items-center gap-1.5 text-editorial-text">
          <SpeakerWaveIcon className={cn('h-3.5 w-3.5', isPlaying && 'text-accent animate-pulse')} />
          <span>{isPlaying ? 'Listening...' : isPaused ? 'Paused' : 'Listen'}</span>
        </span>

        {/* Animated Soundwave Bars when playing */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3 px-1">
            <span className="w-0.5 bg-editorial-text h-full animate-[bounce_0.6s_ease-in-out_infinite]" />
            <span className="w-0.5 bg-editorial-text h-2/3 animate-[bounce_0.8s_ease-in-out_infinite_0.1s]" />
            <span className="w-0.5 bg-editorial-text h-full animate-[bounce_0.5s_ease-in-out_infinite_0.2s]" />
            <span className="w-0.5 bg-editorial-text h-1/2 animate-[bounce_0.7s_ease-in-out_infinite_0.3s]" />
          </div>
        )}
      </div>

      {/* Speed Rate Toggle */}
      <button
        type="button"
        onClick={cycleRate}
        className="px-2 py-0.5 rounded-full border border-editorial-border/80 bg-editorial-surface-subtle hover:bg-editorial-text hover:text-editorial-bg text-editorial-muted hover:border-editorial-text text-[11px] font-mono font-semibold transition-all cursor-pointer shrink-0"
        title="Change audio playback speed"
      >
        {currentRate}x
      </button>

      {/* Stop button when active */}
      {(isPlaying || isPaused) && (
        <button
          type="button"
          onClick={handleStop}
          className="p-1 rounded-full text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer shrink-0"
          title="Stop narration"
          aria-label="Stop narration"
        >
          <StopIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
