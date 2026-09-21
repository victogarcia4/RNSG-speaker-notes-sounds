import React, { useState } from 'react';
import { 
  Volume2, 
  Copy, 
  Check, 
  Edit3, 
  Sparkles, 
  Bookmark, 
  FileText, 
  Clock, 
  BookOpen, 
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { SlideItem } from '../types';

interface SlideViewerProps {
  slide: SlideItem;
  isPlaying: boolean;
  isPaused: boolean;
  spokenCharIndex: number;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onUpdateNarration: (newText: string) => void;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slide,
  isPlaying,
  isPaused,
  spokenCharIndex,
  onPlay,
  onPause,
  onResume,
  onUpdateNarration,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(slide.narration);

  // Sync edited text if slide changes
  React.useEffect(() => {
    setEditedText(slide.narration);
    setIsEditing(false);
  }, [slide.id, slide.narration]);

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(slide.narration);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    onUpdateNarration(editedText);
    setIsEditing(false);
  };

  // Render narration with live highlighted reading position
  const renderHighlightedNarration = () => {
    if (!isPlaying || spokenCharIndex <= 0) {
      return (
        <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg font-normal whitespace-pre-wrap selection:bg-indigo-100">
          {slide.narration}
        </p>
      );
    }

    const spokenPart = slide.narration.slice(0, spokenCharIndex);
    const remainingPart = slide.narration.slice(spokenCharIndex);

    return (
      <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg font-normal whitespace-pre-wrap">
        <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-medium px-1 rounded transition-colors duration-100">
          {spokenPart}
        </span>
        <span>{remainingPart}</span>
      </p>
    );
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 pb-28">
      {/* Slide Meta Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
        {/* Top bar: Slide number, category badge, and timing stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-100 dark:border-indigo-800/60">
              Slide {slide.slideNumber} of 70
            </span>

            {slide.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Bookmark className="w-3 h-3 text-indigo-500" />
                {slide.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{slide.wordCount} words</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>~{slide.estimatedSeconds}s delivery</span>
            </div>
          </div>
        </div>

        {/* Slide Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          {slide.title}
        </h2>

        {/* Action strip */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                id={`play-btn-slide-${slide.slideNumber}`}
                onClick={onPlay}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen to Voice</span>
              </button>
            ) : isPaused ? (
              <button
                id={`resume-btn-slide-${slide.slideNumber}`}
                onClick={onResume}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Resume Voice</span>
              </button>
            ) : (
              <button
                id={`pause-btn-slide-${slide.slideNumber}`}
                onClick={onPause}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Pause Voice</span>
              </button>
            )}

            <button
              id={`edit-notes-btn-${slide.slideNumber}`}
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Script'}</span>
            </button>
          </div>

          <button
            id={`copy-notes-btn-${slide.slideNumber}`}
            onClick={handleCopyNotes}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Speaker Notes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Speaker Notes / Narration Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Spoken Narration &amp; Speaker Notes Script</span>
          </div>

          {isPlaying && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Narration Active
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={10}
              className="w-full p-4 rounded-xl border border-indigo-300 dark:border-indigo-600 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter slide narration text..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            {renderHighlightedNarration()}
          </div>
        )}

        {/* Medical & Nursing Teaching Notes Banner */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start gap-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4">
          <Stethoscope className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Google Slides Sync Tip
            </p>
            <p>
              This narration text will automatically be inserted into the speaker notes of slide #{slide.slideNumber} when running the Google Apps Script in your presentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
