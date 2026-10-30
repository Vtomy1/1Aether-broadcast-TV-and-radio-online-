import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  PictureInPicture2,
  Radio,
  Tv,
  Calendar,
  Sliders,
  Moon,
  Mic,
  Square,
  AlertCircle,
  RotateCw,
  Sparkles,
  ExternalLink,
  Star
} from 'lucide-react';
import { Station, VisualizerMode, RecordedClip } from '../types';
import { VisualizerCanvas } from './VisualizerCanvas';

interface MediaPlayerProps {
  station: Station;
  isFavorite: boolean;
  onToggleFavorite: (station: Station) => void;
  onOpenSchedule: () => void;
  onOpenEqualizer: () => void;
  onOpenSleepTimer: () => void;
  onNewRecording: (clip: RecordedClip) => void;
  sleepRemainingSeconds: number | null;
  eqGains: number[];
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  station,
  isFavorite,
  onToggleFavorite,
  onOpenSchedule,
  onOpenEqualizer,
  onOpenSleepTimer,
  onNewRecording,
  sleepRemainingSeconds,
  eqGains
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPiPActive, setIsPiPActive] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'16/9' | 'fit' | 'fill'>('16/9');
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('bars');
  const [usingBackup, setUsingBackup] = useState<boolean>(false);

  // Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  // Web Audio Context & Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const eqFiltersRef = useRef<BiquadFilterNode[]>([]);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const mediaDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);

  // Clean Hls instance
  const hlsRef = useRef<Hls | null>(null);

  const currentStreamUrl = usingBackup && station.backupStreamUrl ? station.backupStreamUrl : station.streamUrl;

  // Initialize Web Audio graph
  const setupWebAudio = useCallback((element: HTMLMediaElement) => {
    try {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        // Create 5 EQ peaking filters (60Hz, 250Hz, 1kHz, 4kHz, 14kHz)
        const freqs = [60, 250, 1000, 4000, 14000];
        const filters = freqs.map((freq, idx) => {
          const filter = ctx.createBiquadFilter();
          filter.type = idx === 0 ? 'lowshelf' : idx === 4 ? 'highshelf' : 'peaking';
          filter.frequency.value = freq;
          filter.gain.value = eqGains[idx] || 0;
          return filter;
        });
        eqFiltersRef.current = filters;

        // Destination for recorder
        const dest = ctx.createMediaStreamDestination();
        mediaDestRef.current = dest;

        // Connect media element
        // Note: element must have crossOrigin = "anonymous" for CORS-compliant audio,
        // or WebAudio routes without security error
        try {
          const source = ctx.createMediaElementSource(element);
          sourceNodeRef.current = source;

          // Wire filters: source -> f0 -> f1 -> f2 -> f3 -> f4 -> analyser -> (ctx.destination & dest)
          let lastNode: AudioNode = source;
          filters.forEach((filter) => {
            lastNode.connect(filter);
            lastNode = filter;
          });
          lastNode.connect(analyser);
          analyser.connect(ctx.destination);
          analyser.connect(dest);
        } catch {
          // In case element is already connected or CORS blocked
        }
      }
    } catch {
      // Graceful fallback if Web Audio is unsupported
    }
  }, [eqGains]);

  // Sync Equalizer gains to BiquadFilterNodes
  useEffect(() => {
    if (eqFiltersRef.current.length === 5) {
      eqGains.forEach((gain, idx) => {
        if (eqFiltersRef.current[idx]) {
          eqFiltersRef.current[idx].gain.value = gain;
        }
      });
    }
  }, [eqGains]);

  // Active element selector
  const activeMediaElement = station.type === 'tv' ? videoRef.current : audioRef.current;

  // Stream initialization and mounting
  useEffect(() => {
    setErrorMsg(null);
    setIsBuffering(true);
    setUsingBackup(false);

    const isTv = station.type === 'tv';
    const mediaEl = isTv ? videoRef.current : audioRef.current;
    if (!mediaEl) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    mediaEl.volume = isMuted ? 0 : volume;

    const streamUrl = currentStreamUrl;
    const isM3u8 = station.isHls || streamUrl.includes('.m3u8');

    if (isM3u8 && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 30
      });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(mediaEl);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        mediaEl.play().then(() => {
          setIsPlaying(true);
          setupWebAudio(mediaEl);
        }).catch(() => {
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (!usingBackup && station.backupStreamUrl) {
                setUsingBackup(true);
                hls.loadSource(station.backupStreamUrl);
                hls.startLoad();
              } else {
                setErrorMsg('Network transmission dropped. Retrying stream...');
                hls.startLoad();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setErrorMsg('Stream momentarily unavailable. Click retry to reconnect.');
              break;
          }
        }
      });
    } else if (mediaEl.canPlayType('application/vnd.apple.mpegurl') || !isM3u8) {
      // Native Safari HLS or direct MP3/AAC audio stream
      mediaEl.src = streamUrl;
      mediaEl.load();

      const onCanPlay = () => {
        setIsBuffering(false);
        mediaEl.play().then(() => {
          setIsPlaying(true);
          setupWebAudio(mediaEl);
        }).catch(() => {
          setIsPlaying(false);
        });
      };

      const onWaiting = () => setIsBuffering(true);
      const onPlaying = () => {
        setIsBuffering(false);
        setIsPlaying(true);
      };
      const onError = () => {
        setIsBuffering(false);
        if (!usingBackup && station.backupStreamUrl) {
          setUsingBackup(true);
        } else {
          setErrorMsg('Unable to connect to live stream. Server may be in maintenance.');
        }
      };

      mediaEl.addEventListener('canplay', onCanPlay);
      mediaEl.addEventListener('waiting', onWaiting);
      mediaEl.addEventListener('playing', onPlaying);
      mediaEl.addEventListener('error', onError);

      return () => {
        mediaEl.removeEventListener('canplay', onCanPlay);
        mediaEl.removeEventListener('waiting', onWaiting);
        mediaEl.removeEventListener('playing', onPlaying);
        mediaEl.removeEventListener('error', onError);
      };
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [station.id, currentStreamUrl, setupWebAudio, station.isHls, station.backupStreamUrl, usingBackup, volume, isMuted, station.type]);

  // Sync MediaSession
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station.name,
        artist: station.description,
        album: `${station.type.toUpperCase()} · ${station.country}`
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
    }
  }, [station]);

  const togglePlay = () => {
    const el = activeMediaElement;
    if (!el) return;

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      setErrorMsg(null);
      setIsBuffering(true);
      el.play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
          setupWebAudio(el);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsBuffering(false);
        });
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (activeMediaElement) {
      activeMediaElement.volume = isMuted ? 0 : newVol;
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (activeMediaElement) {
      activeMediaElement.volume = next ? 0 : volume;
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        // Fullscreen not permitted
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        setIsPiPActive(true);
      }
    } catch {
      // PiP error
    }
  };

  const handleRetry = () => {
    setErrorMsg(null);
    setIsBuffering(true);
    const el = activeMediaElement;
    if (el) {
      el.load();
      el.play().catch(() => {});
    }
  };

  // Recording feature
  const startRecording = () => {
    try {
      let streamToRecord: MediaStream | null = null;

      if (mediaDestRef.current && mediaDestRef.current.stream.getAudioTracks().length > 0) {
        streamToRecord = mediaDestRef.current.stream;
      } else if (activeMediaElement && 'captureStream' in activeMediaElement) {
        streamToRecord = (activeMediaElement as HTMLMediaElement & { captureStream: () => MediaStream }).captureStream();
      }

      if (!streamToRecord) {
        alert('Live audio stream capture is currently restricted by browser audio cross-origin rules for this host.');
        return;
      }

      recordedChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(streamToRecord, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        const clip: RecordedClip = {
          id: `rec-${Date.now()}`,
          stationName: station.name,
          stationType: station.type,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          durationSeconds: recordingSeconds,
          blobUrl,
          sizeBytes: blob.size
        };
        onNewRecording(clip);
        setIsRecording(false);
        setRecordingSeconds(0);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };

      recorder.start(1000);
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Recording start failed:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Currently airing show title computation
  const currentProgram = useMemo(() => {
    if (!station.schedule || station.schedule.length === 0) return null;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    return station.schedule.find((p) => {
      const s = p.startHour * 60 + p.startMinute;
      const e = s + p.durationMinutes;
      return currentMins >= s && currentMins < e;
    }) || station.schedule[0];
  }, [station]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''
      }`}
    >
      {/* Visual Surface Area */}
      <div className="relative w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
        {station.type === 'tv' ? (
          <video
            ref={videoRef}
            playsInline
            crossOrigin="anonymous"
            className={`w-full h-full ${
              aspectRatio === 'fill' ? 'object-cover' : aspectRatio === 'fit' ? 'object-contain' : 'object-cover'
            }`}
          />
        ) : (
          // Radio Visual Stage
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6">
            {/* Background poster with soft cinematic blur */}
            {station.posterUrl && (
              <img
                src={station.posterUrl}
                alt={station.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-md scale-105 pointer-events-none"
              />
            )}

            {/* Visualizer Backdrop */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-85 pointer-events-none">
              <VisualizerCanvas
                isPlaying={isPlaying}
                mode={visualizerMode}
                analyser={analyserRef.current}
              />
            </div>

            {/* Central Station Info Badge */}
            <div className="relative z-10 text-center max-w-md mx-auto p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/40 shadow-xl">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <Radio className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">{station.name}</h2>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-300 mt-1 font-mono">
                <span>{station.country}</span>
                <span aria-hidden="true">·</span>
                <span>{station.bitrate || '128 kbps MP3'}</span>
                <span aria-hidden="true">·</span>
                <span>{station.category.toUpperCase()}</span>
              </div>
              {currentProgram && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <div className="text-[11px] font-medium text-sky-400 uppercase tracking-wider">Airing Live</div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">{currentProgram.title}</div>
                </div>
              )}
            </div>

            {/* Hidden audio element for radio */}
            <audio
              ref={audioRef}
              crossOrigin="anonymous"
              preload="auto"
            />
          </div>
        )}

        {/* Buffering Indicator */}
        {isBuffering && !errorMsg && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 pointer-events-none">
            <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-xs font-mono text-slate-300">Tuning broadcast frequency...</span>
          </div>
        )}

        {/* Error Overlay */}
        {errorMsg && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center z-30">
            <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
            <h3 className="text-base font-semibold text-white">Stream Signal Disrupted</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">{errorMsg}</p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Reconnect Stream
              </button>
              {station.backupStreamUrl && !usingBackup && (
                <button
                  onClick={() => setUsingBackup(true)}
                  className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  Switch to Backup Feed
                </button>
              )}
            </div>
          </div>
        )}

        {/* On-air recording badge */}
        {isRecording && (
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600/90 text-white text-xs font-mono shadow-lg animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span>REC {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}</span>
          </div>
        )}

        {/* Sleep timer floating badge if active */}
        {sleepRemainingSeconds !== null && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-mono">
            <Moon className="w-3.5 h-3.5" />
            <span>{Math.floor(sleepRemainingSeconds / 60)}m left</span>
          </div>
        )}
      </div>

      {/* Broadcast Control Dashboard */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Station Identity & Live Ticker */}
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-11 h-11 shrink-0 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/25 transition-all transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white truncate">{station.name}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  LIVE
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 truncate mt-0.5">
                <span>{station.country}</span>
                <span aria-hidden="true">·</span>
                <span>{currentProgram ? currentProgram.title : station.category.toUpperCase()}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-slate-400">{station.quality || station.bitrate || 'Online'}</span>
              </div>
            </div>

            <button
              onClick={() => onToggleFavorite(station)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2 rounded-lg border transition-colors shrink-0 ${
                isFavorite
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Right: Technical Controls (Volume, EQ, Guide, Sleep, Recording, Fullscreen) */}
          <div className="flex items-center flex-wrap gap-2 lg:gap-3">
            {/* Volume */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 md:w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <span className="text-[11px] font-mono tabular-nums text-slate-400 w-7 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* Visualizer mode for Radio */}
            {station.type === 'radio' && (
              <div className="flex items-center gap-1 p-1 bg-slate-950/60 border border-slate-800 rounded-lg">
                {(['bars', 'wave', 'circle', 'spectrum'] as VisualizerMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setVisualizerMode(mode)}
                    className={`px-2 py-1 text-[11px] font-medium rounded capitalize transition-colors ${
                      visualizerMode === mode
                        ? 'bg-sky-500/20 text-sky-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}

            {/* Live Recorder (Only on Radio) */}
            {station.type === 'radio' && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  isRecording
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
                }`}
                title={isRecording ? 'Stop Recording' : 'Record snippet from live stream'}
              >
                {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5 text-rose-400" />}
                <span>{isRecording ? 'Stop' : 'Record'}</span>
              </button>
            )}

            {/* Equalizer */}
            <button
              onClick={onOpenEqualizer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750 transition-colors"
              title="Open audio equalizer"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>EQ</span>
            </button>

            {/* EPG Schedule */}
            <button
              onClick={onOpenSchedule}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750 transition-colors"
              title="Station schedule & electronic program guide"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Guide</span>
            </button>

            {/* Sleep Timer */}
            <button
              onClick={onOpenSleepTimer}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                sleepRemainingSeconds !== null
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Set sleep timer"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Timer</span>
            </button>

            {/* TV specific controls: Aspect ratio & PiP */}
            {station.type === 'tv' && (
              <>
                <button
                  onClick={() => setAspectRatio(prev => prev === '16/9' ? 'fill' : prev === 'fill' ? 'fit' : '16/9')}
                  className="px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white"
                  title="Cycle aspect ratio (16:9, Fill, Fit)"
                >
                  {aspectRatio.toUpperCase()}
                </button>

                <button
                  onClick={togglePiP}
                  className={`p-2 rounded-lg border transition-colors ${
                    isPiPActive
                      ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Picture in Picture"
                >
                  <PictureInPicture2 className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Official Website */}
            {station.website && (
              <a
                href={station.website}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Visit broadcaster website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
