import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCode, 
  Terminal, 
  Download, 
  UploadCloud, 
  Menu, 
  Presentation,
  Clock,
  FileText,
  ChevronDown,
  Check,
  BookOpen,
  Layers,
  Sparkles
} from 'lucide-react';
import { LectureData } from '../types';
import { LECTURE_DECKS_METADATA } from '../data/lectures';

interface NavbarProps {
  lecture: LectureData;
  activeDeckId: string;
  onSelectDeck: (deckId: string) => void;
  activeSlideNumber: number;
  onOpenAppsScript: () => void;
  onOpenPythonScript: () => void;
  onOpenUploadModal: () => void;
  onExportJson: () => void;
  onExportAllJson: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lecture,
  activeDeckId,
  onSelectDeck,
  activeSlideNumber,
  onOpenAppsScript,
  onOpenPythonScript,
  onOpenUploadModal,
  onExportJson,
  onExportAllJson,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const n1Decks = LECTURE_DECKS_METADATA.filter(d => d.course === 'Nursing 1');
  const n3Decks = LECTURE_DECKS_METADATA.filter(d => d.course === 'Nursing 3');

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-2.5 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Deck Dropdown Selector */}
        <div className="flex items-center gap-3">
          <button
            id="toggle-sidebar-btn"
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isSidebarOpen 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle Slide Deck Drawer"
            aria-label="Toggle Slide Deck Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Presentation Deck Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="deck-selector-dropdown-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Presentation className="w-4 h-4" />
              </div>
              <div className="max-w-[210px] sm:max-w-xs md:max-w-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                    {lecture.course}
                  </span>
                  <span className="text-xs font-semibold text-white truncate group-hover:text-indigo-200">
                    {lecture.title}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>{lecture.totalSlides} slides</span>
                  <span>•</span>
                  <span>{lecture.totalWords.toLocaleString()} words</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-transform ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/90 p-2.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-1.5 mb-1.5 flex items-center justify-between border-b border-slate-800">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Select Presentation Deck
                  </span>
                  <span className="text-[10px] text-indigo-400 font-medium bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60">
                    8 Decks • 432 Slides
                  </span>
                </div>

                {/* Nursing 1 Section */}
                <div className="mb-2">
                  <div className="px-2 py-1 text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Nursing 1 (N1) — Foundations &amp; Care
                  </div>
                  <div className="space-y-1">
                    {n1Decks.map((deck) => {
                      const isActive = activeDeckId === deck.id;
                      return (
                        <button
                          key={deck.id}
                          onClick={() => {
                            onSelectDeck(deck.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl transition-all flex items-start justify-between gap-2 cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600/20 text-white border border-indigo-500/40'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="font-medium flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-indigo-400">{deck.day}:</span>
                              <span className="line-clamp-1">{deck.title}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                              {deck.subtitle}
                            </p>
                          </div>
                          {isActive && (
                            <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nursing 3 Section */}
                <div>
                  <div className="px-2 py-1 text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Nursing 3 (N3) — Complex &amp; Emergencies
                  </div>
                  <div className="space-y-1">
                    {n3Decks.map((deck) => {
                      const isActive = activeDeckId === deck.id;
                      return (
                        <button
                          key={deck.id}
                          onClick={() => {
                            onSelectDeck(deck.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl transition-all flex items-start justify-between gap-2 cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600/20 text-white border border-indigo-500/40'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="font-medium flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-rose-400">{deck.day}:</span>
                              <span className="line-clamp-1">{deck.title}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                              {deck.subtitle}
                            </p>
                          </div>
                          {isActive && (
                            <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Stats */}
        <div className="hidden xl:flex items-center gap-4 bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-indigo-400 font-semibold">Slide {activeSlideNumber}</span>
            <span className="text-slate-500">of</span>
            <span className="font-semibold text-white">{lecture.totalSlides}</span>
          </div>
          <div className="h-3.5 w-px bg-slate-700"></div>
          <div className="flex items-center gap-1 text-slate-400">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{lecture.totalWords.toLocaleString()} words</span>
          </div>
          <div className="h-3.5 w-px bg-slate-700"></div>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~{lecture.estimatedMinutes} min delivery</span>
          </div>
        </div>

        {/* Right: Integration & Export Actions */}
        <div className="flex items-center gap-2">
          <button
            id="google-apps-script-btn"
            onClick={onOpenAppsScript}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors cursor-pointer"
            title="Generate Google Apps Script for Google Slides"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Google Apps Script</span>
            <span className="sm:hidden">Apps Script</span>
          </button>

          <button
            id="python-script-btn"
            onClick={onOpenPythonScript}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Generate Python Script for Slides API"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Python Sync</span>
          </button>

          <button
            id="export-deck-btn"
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Export Current Deck as JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Export Deck</span>
          </button>

          <button
            id="export-all-decks-btn"
            onClick={onExportAllJson}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Export All 8 Presentations as Combined JSON"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden xl:inline">Export All (432)</span>
          </button>

          <button
            id="custom-upload-btn"
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Test Custom File"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Upload Script</span>
          </button>
        </div>
      </div>
    </header>
  );
};
