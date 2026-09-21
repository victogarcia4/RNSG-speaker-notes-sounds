import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Volume2, 
  CheckCircle2, 
  Bookmark, 
  Filter,
  FileText
} from 'lucide-react';
import { SlideItem } from '../types';

interface SlideListDrawerProps {
  slides: SlideItem[];
  activeSlideId: number;
  onSelectSlide: (slide: SlideItem) => void;
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
}

export const SlideListDrawer: React.FC<SlideListDrawerProps> = ({
  slides,
  activeSlideId,
  onSelectSlide,
  isOpen,
  onClose,
  isPlaying,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    slides.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [slides]);

  const filteredSlides = useMemo(() => {
    return slides.filter(s => {
      const matchesSearch = 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.slideNumber.toString() === searchTerm.trim();
      
      const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [slides, searchTerm, selectedCategory]);

  if (!isOpen) return null;

  return (
    <aside 
      id="slide-deck-drawer"
      className="fixed inset-y-0 left-0 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-all"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Slide Deck Outline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {slides.length} slides loaded
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close slide list"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-950">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="slide-search-input"
            type="text"
            placeholder="Search slides, topics, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-1">
        {filteredSlides.length === 0 ? (
          <div className="text-center py-10 px-4 text-xs text-slate-400">
            No slides found matching "{searchTerm}"
          </div>
        ) : (
          filteredSlides.map((slide) => {
            const isActive = slide.id === activeSlideId;
            return (
              <button
                key={slide.id}
                id={`drawer-slide-item-${slide.slideNumber}`}
                onClick={() => {
                  onSelectSlide(slide);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {slide.slideNumber}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs font-semibold truncate ${
                      isActive ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {slide.title}
                    </p>
                    {isActive && isPlaying && (
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 animate-pulse" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {slide.narration}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                    <span>{slide.wordCount} words</span>
                    <span>·</span>
                    <span>~{slide.estimatedSeconds}s</span>
                    {slide.category && (
                      <>
                        <span>·</span>
                        <span className="text-indigo-500 font-medium">{slide.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
