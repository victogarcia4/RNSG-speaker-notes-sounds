import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  RotateCcw, 
  FileText, 
  Sparkles,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { parseNarrationScript } from '../utils/parser';
import { SlideItem } from '../types';
import { LECTURE_DECKS_METADATA, getLectureById } from '../data/lectures';

interface CustomFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadCustomSlides: (slides: SlideItem[], title?: string) => void;
  onResetToSample: () => void;
  onSelectPreloadedDeck?: (deckId: string) => void;
}

export const CustomFileModal: React.FC<CustomFileModalProps> = ({
  isOpen,
  onClose,
  onLoadCustomSlides,
  onResetToSample,
  onSelectPreloadedDeck,
}) => {
  const [scriptText, setScriptText] = useState('');
  const [deckTitle, setDeckTitle] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'es'>('all');

  if (!isOpen) return null;

  const filteredDecks = LECTURE_DECKS_METADATA.filter(d => 
    selectedLanguage === 'all' ? true : d.language === selectedLanguage
  );

  const handleParseAndLoad = () => {
    if (!scriptText.trim()) {
      setParseError('Please paste narration text or upload a file.');
      return;
    }

    try {
      const parsed = parseNarrationScript(scriptText);
      if (parsed.length === 0) {
        setParseError("Could not detect any slides. Format should be: 'Slide 1 — Title' followed by narration.");
        return;
      }

      onLoadCustomSlides(parsed, deckTitle || 'Custom Presentation Script');
      onClose();
    } catch (err: any) {
      setParseError(err.message || 'Error parsing script file.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setScriptText(content);
      if (!deckTitle) {
        setDeckTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Load Speaker Notes or Upload Custom File
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose from pre-loaded Dr. Victor Garcia Martinez presentations or import your own
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* Quick select curriculum decks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Pre-Loaded Curriculum Decks (Click to load):
              </label>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    selectedLanguage === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All (16)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    selectedLanguage === 'en'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  EN (8)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('es')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    selectedLanguage === 'es'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  ES (8)
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredDecks.map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => {
                    if (onSelectPreloadedDeck) {
                      onSelectPreloadedDeck(deck.id);
                    } else {
                      const lec = getLectureById(deck.id);
                      onLoadCustomSlides(lec.slides, lec.title);
                    }
                    onClose();
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>{deck.course} • {deck.day}</span>
                    <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      {deck.language.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-900 dark:text-white line-clamp-1 mt-0.5 group-hover:text-indigo-300">
                    {deck.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Or Paste / Upload Custom Script</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-800 dark:text-slate-200">
              Custom Deck Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Pharmacology Lecture 2"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Speaker Notes Script Content
              </label>
              <label className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer">
                Upload .txt / .md
                <input
                  type="file"
                  accept=".txt,.md,.text"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={scriptText}
              onChange={(e) => {
                setScriptText(e.target.value);
                setParseError(null);
              }}
              rows={6}
              placeholder={`Slide 1 — Introduction\nWelcome everyone to our presentation...\n\nSlide 2 — Next Topic\nHere are our objectives...`}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {parseError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                onResetToSample();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to N1 Day 1</span>
            </button>

            <button
              onClick={handleParseAndLoad}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              Parse &amp; Load Custom Script
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
