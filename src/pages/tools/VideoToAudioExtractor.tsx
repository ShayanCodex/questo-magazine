import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MusicalNoteIcon,
  VideoCameraIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PauseIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Seo } from '../../components/Seo';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { useLanguage } from '../../lib/lang-context';
import { Button } from '../../components/ui/button';

export function VideoToAudioExtractor() {
  const { t, localePath } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [audioMime, setAudioMime] = useState<string>('audio/webm');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: 'Tools', href: localePath('/tools') },
    { label: 'Browser Video-to-Audio Extractor' },
  ];

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file (MP4, WebM, MOV, MKV).');
      return;
    }

    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (audioUrl) URL.revokeObjectURL(audioUrl);

    setSelectedFile(file);
    setAudioUrl(null);
    setAudioBlob(null);
    setIsExtracting(false);

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  // Setup Web Audio API & Visualizer
  const setupAudioGraph = useCallback(() => {
    if (!videoRef.current || audioContextRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaElementSource(videoRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      source.connect(analyser);
      analyser.connect(ctx.destination);
    } catch {
      // Already connected or browser restrictions
    }
  }, []);

  // Animate audio frequency bars
  const renderVisualizer = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = '#10B981'; // emerald-500
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };

    draw();
  }, []);

  const handleStartExtraction = async () => {
    if (!videoRef.current) return;

    setupAudioGraph();
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    renderVisualizer();

    const video = videoRef.current;
    video.currentTime = 0;
    audioChunksRef.current = [];

    // Capture audio stream directly from HTMLMediaElement
    try {
      let stream: MediaStream;
      if ('captureStream' in video) {
        stream = (video as unknown as { captureStream: () => MediaStream }).captureStream();
      } else if ('mozCaptureStream' in video) {
        stream = (video as unknown as { mozCaptureStream: () => MediaStream }).mozCaptureStream();
      } else {
        alert('Your browser does not support stream capture. Please use Chrome, Edge, or Firefox.');
        return;
      }

      // Filter to only the audio tracks
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        alert('No audio track detected in this video file.');
        return;
      }

      const audioStream = new MediaStream(audioTracks);

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      setAudioMime(mimeType);

      const recorder = new MediaRecorder(audioStream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setIsExtracting(false);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };

      recorder.start(100);
      setIsExtracting(true);
      video.play();

      video.onended = () => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      };
    } catch {
      alert('Error initializing browser audio recorder.');
      setIsExtracting(false);
    }
  };

  const handleStopExtraction = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsExtracting(false);
  };

  const handleDownload = () => {
    if (!audioUrl || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'extracted-audio';
    const ext = audioMime.includes('webm') ? 'webm' : 'ogg';
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${baseName}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [videoUrl, audioUrl]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      <Seo
        title="Web Audio Video-to-Audio Extractor — 100% In-Browser | Questo Tools"
        description="Extract audio tracks from MP4, WebM, and MOV video files directly in your browser using the HTML5 Web Audio API. Zero server upload, zero latency, 100% private."
        pathname="/tools/audio-extractor"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="space-y-3 border-b border-editorial-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-editorial-surface border border-editorial-border text-editorial-text">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span>Web Audio API • Zero Server Cost • Real-Time Stream Capture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-editorial-text">
          Browser Video-to-Audio Extractor
        </h1>
        <p className="font-serif text-editorial-muted text-base sm:text-lg leading-relaxed max-w-3xl">
          Rip and isolate audio soundtracks from video files locally using browser Web Audio API stream capture. No file data is ever transmitted across the internet.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-editorial-border hover:border-editorial-text/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-editorial-surface/40 hover:bg-editorial-surface/80 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
            <VideoCameraIcon className="w-12 h-12 mx-auto text-editorial-muted group-hover:text-editorial-text transition-colors" />
            <p className="mt-3 text-sm font-semibold text-editorial-text font-sans">
              Select or drop any video file
            </p>
            <p className="text-xs text-editorial-muted mt-1 font-mono">
              Supports MP4, WebM, MOV, MKV (Up to 500MB)
            </p>
          </div>

          {selectedFile && (
            <div className="space-y-4 bg-editorial-surface border border-editorial-border rounded-xl p-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-editorial-muted block">Video Title</span>
                <p className="text-xs font-sans font-semibold text-editorial-text truncate">
                  {selectedFile.name}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-editorial-muted pt-2 border-t border-editorial-border">
                <span>Duration: {formatTime(duration)}</span>
                <span>Size: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</span>
              </div>

              {/* Extraction Trigger */}
              {!isExtracting ? (
                <Button
                  onClick={handleStartExtraction}
                  className="w-full py-3 bg-editorial-text text-editorial-bg hover:opacity-90 rounded-lg font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  <SparklesIcon className="w-4 h-4 me-2" />
                  Extract Audio Track Now
                </Button>
              ) : (
                <Button
                  onClick={handleStopExtraction}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  <PauseIcon className="w-4 h-4 me-2" />
                  Finish &amp; Finalize Audio ({formatTime(currentTime)} / {formatTime(duration)})
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Video Player & Waveform Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          {videoUrl ? (
            <div className="bg-editorial-surface border border-editorial-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans uppercase font-semibold text-editorial-text tracking-wider">
                  Real-Time Video Player
                </span>
                {isExtracting && (
                  <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Recording Stream...
                  </span>
                )}
              </div>

              <div className="rounded-lg overflow-hidden border border-editorial-border bg-black max-h-[340px] flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls={!isExtracting}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  className="w-full max-h-[340px] object-contain"
                />
              </div>

              {/* Canvas Waveform Visualizer */}
              <div className="p-3 bg-editorial-bg border border-editorial-border rounded-lg space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-editorial-muted">
                  <span>Web Audio Frequency Visualizer</span>
                  <span>{isExtracting ? 'Active' : 'Standby'}</span>
                </div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={50}
                  className="w-full h-12 bg-editorial-surface/50 rounded-xs"
                />
              </div>

              {/* Download Extracted Audio Section */}
              {audioUrl && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircleIcon className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-mono font-semibold">
                      Audio extracted successfully ({audioBlob ? (audioBlob.size / 1024).toFixed(1) + ' KB' : ''})
                    </span>
                  </div>
                  <audio src={audioUrl} controls className="w-full h-10" />
                  <Button
                    onClick={handleDownload}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-md"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 me-2" />
                    Download Extracted Audio Track
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[340px] flex flex-col items-center justify-center rounded-xl border border-editorial-border bg-editorial-surface/30 p-8 text-center text-editorial-muted">
              <MusicalNoteIcon className="w-12 h-12 mb-3 text-editorial-muted/40" />
              <p className="font-serif text-base text-editorial-text">No video loaded</p>
              <p className="text-xs font-mono max-w-sm mt-1">
                Select any video file to preview and extract high-fidelity audio directly within your browser runtime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
