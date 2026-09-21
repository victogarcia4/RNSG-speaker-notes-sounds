import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  RotateCcw, 
  FastForward,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SlideItem } from '../types';

interface AudioPlayerBarProps {
  currentSlide: SlideItem;
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelectVoice: (voice: SpeechSynthesisVoice) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  autoAdvance: boolean;
  onToggleAutoAdvance: (val: boolean) => void;
  hasNext: boolean;
  hasPrev: boolean;
  spokenCharIndex: number;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentSlide,
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
  onNextSlide,
  onPrevSlide,
  voices,
  selectedVoice,
  onSelectVoice,
  rate,
  onRateChange,
  autoAdvance,
  onToggleAutoAdvance,
  hasNext,
  hasPrev,
  spokenCharIndex,
}) => {
  const textLength = currentSlide.narration.length;
  const progressPercent = textLength > 0 ? Math.min(100, Math.round((spokenCharIndex / textLength) * 100)) : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-100 shadow-2xl px-4 py-3">
      {/* Progress line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Active Slide Info & Wave */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600/30 text-indigo-300 font-bold text-xs border border-indigo-500/40">
              {currentSlide.slideNumber}
            </span>
            <div className="max-w-[200px] sm:max-w-xs truncate">
              <p className="text-xs font-medium text-white truncate">
                {currentSlide.title}
              </p>
              <p className="text-[11px] text-slate-400">
                {currentSlide.wordCount} words · est. {Math.round(currentSlide.estimatedSeconds / rate)}s
              </p>
            </div>
          </div>

          {isPlaying && !isPaused && (
            <div className="flex items-center gap-0.5 px-2 py-1 rounded bg-indigo-950/60 border border-indigo-800/60">
              <span className="w-1 h-3 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-5 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
              <span className="text-[10px] text-indigo-300 ml-1 font-mono font-medium">Speaking</span>
            </div>
          )}
        </div>

        {/* Center: Main Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            id="prev-slide-btn"
            onClick={onPrevSlide}
            disabled={!hasPrev}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Previous Slide"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {!isPlaying ? (
            <button
              id="play-slide-voice-btn"
              onClick={onPlay}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 cursor-pointer"
              title="Play Slide Voice Narration"
            >
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </button>
          ) : isPaused ? (
            <button
              id="resume-slide-voice-btn"
              onClick={onResume}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 cursor-pointer"
              title="Resume Narration"
            >
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </button>
          ) : (
            <button
              id="pause-slide-voice-btn"
              onClick={onPause}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-transform active:scale-95 cursor-pointer"
              title="Pause Narration"
            >
              <Pause className="w-5 h-5 fill-current" />
            </button>
          )}

          {isPlaying && (
            <button
              id="stop-slide-voice-btn"
              onClick={onStop}
              className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Stop Narration"
            >
              <Square className="w-4 h-4" />
            </button>
          )}

          <button
            id="next-slide-btn"
            onClick={onNextSlide}
            disabled={!hasNext}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Next Slide"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Settings (Voice, Rate, Auto-Advance) */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Voice Selector */}
          {voices.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="voice-select-dropdown"
                value={selectedVoice?.voiceURI || ''}
                onChange={(e) => {
                  const v = voices.find(voice => voice.voiceURI === e.target.value);
                  if (v) onSelectVoice(v);
                }}
                className="bg-transparent text-slate-200 text-xs focus:outline-none max-w-[130px] sm:max-w-[160px] truncate cursor-pointer"
                title="Select Voice"
              >
                {voices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI} className="bg-slate-800 text-white">
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-1 py-0.5 rounded-lg border border-slate-700/60">
            {[0.8, 1.0, 1.15, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => onRateChange(s)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  rate === s 
                    ? 'bg-indigo-600 text-white font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Auto Advance Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 hover:bg-slate-800 transition-colors">
            <input
              id="auto-advance-toggle"
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => onToggleAutoAdvance(e.target.checked)}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-[11px] text-slate-300 font-medium">Auto-Advance</span>
          </label>
        </div>
      </div>
    </div>
  );
};
