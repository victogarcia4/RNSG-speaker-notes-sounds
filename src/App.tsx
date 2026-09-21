import React, { useState, useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SlideViewer } from './components/SlideViewer';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { SlideListDrawer } from './components/SlideListDrawer';
import { GoogleAppsScriptModal } from './components/GoogleAppsScriptModal';
import { PythonScriptModal } from './components/PythonScriptModal';
import { CustomFileModal } from './components/CustomFileModal';
import { getLectureById, LECTURE_DECKS_METADATA } from './data/lectures';
import { LectureData, SlideItem } from './types';
import { useSlideSpeech } from './hooks/useSlideSpeech';

export default function App() {
  const [activeDeckId, setActiveDeckId] = useState<string>('n1-day1');
  const [lecture, setLecture] = useState<LectureData>(() => getLectureById('n1-day1'));
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState<boolean>(false);
  const [isPythonModalOpen, setIsPythonModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const activeSlide = lecture.slides[activeSlideIndex] || lecture.slides[0];

  // Auto-advance callback
  const handleSlideComplete = useCallback(() => {
    setActiveSlideIndex((prevIndex) => {
      if (prevIndex < lecture.slides.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  }, [lecture.slides.length]);

  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    isPlaying,
    isPaused,
    rate,
    setRate,
    pitch,
    setPitch,
    speak,
    stop,
    pause,
    resume,
    spokenCharIndex,
    autoAdvance,
    setAutoAdvance,
  } = useSlideSpeech({
    onSlideComplete: handleSlideComplete,
  });

  // Switch between pre-loaded lecture decks
  const handleSelectDeck = useCallback((deckId: string) => {
    stop();
    setActiveDeckId(deckId);
    const newLecture = getLectureById(deckId);
    setLecture(newLecture);
    setActiveSlideIndex(0);
  }, [stop]);

  const handlePlayActiveSlide = useCallback(() => {
    if (activeSlide) {
      speak(activeSlide.narration);
    }
  }, [activeSlide, speak]);

  const handleNextSlide = useCallback(() => {
    if (activeSlideIndex < lecture.slides.length - 1) {
      const nextIndex = activeSlideIndex + 1;
      setActiveSlideIndex(nextIndex);
      if (isPlaying) {
        speak(lecture.slides[nextIndex].narration);
      }
    }
  }, [activeSlideIndex, lecture.slides, isPlaying, speak]);

  const handlePrevSlide = useCallback(() => {
    if (activeSlideIndex > 0) {
      const prevIndex = activeSlideIndex - 1;
      setActiveSlideIndex(prevIndex);
      if (isPlaying) {
        speak(lecture.slides[prevIndex].narration);
      }
    }
  }, [activeSlideIndex, lecture.slides, isPlaying, speak]);

  const handleSelectSlide = useCallback((slide: SlideItem) => {
    const idx = lecture.slides.findIndex(s => s.id === slide.id);
    if (idx !== -1) {
      setActiveSlideIndex(idx);
      if (isPlaying) {
        speak(lecture.slides[idx].narration);
      }
    }
  }, [lecture.slides, isPlaying, speak]);

  const handleUpdateNarration = useCallback((newText: string) => {
    setLecture((prev) => {
      const updatedSlides = [...prev.slides];
      const current = updatedSlides[activeSlideIndex];
      if (current) {
        const wc = newText.split(/\s+/).filter(Boolean).length;
        updatedSlides[activeSlideIndex] = {
          ...current,
          narration: newText,
          wordCount: wc,
          estimatedSeconds: Math.round((wc / 130) * 60),
        };
      }
      return {
        ...prev,
        slides: updatedSlides,
      };
    });
  }, [activeSlideIndex]);

  const handleLoadCustomSlides = useCallback((slides: SlideItem[], title?: string) => {
    stop();
    setActiveDeckId('custom');
    const totalWords = slides.reduce((acc, s) => acc + s.wordCount, 0);
    const totalSeconds = slides.reduce((acc, s) => acc + s.estimatedSeconds, 0);
    setLecture({
      title: title || 'Custom Presentation Script',
      course: 'Custom Deck',
      author: 'Uploaded Presenter',
      totalSlides: slides.length,
      totalWords,
      estimatedMinutes: Math.round(totalSeconds / 60),
      slides,
    });
    setActiveSlideIndex(0);
  }, [stop]);

  const handleResetToSample = useCallback(() => {
    handleSelectDeck('n1-day1');
  }, [handleSelectDeck]);

  // Export current deck
  const handleExportJson = useCallback(() => {
    const filename = `${lecture.course.replace(/[^a-zA-Z0-9]/g, '_')}_${lecture.totalSlides}_slides.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lecture, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [lecture]);

  // Export all 8 decks combined
  const handleExportAllJson = useCallback(() => {
    const allDecks = LECTURE_DECKS_METADATA.map(meta => getLectureById(meta.id));
    const combinedData = {
      project: "Google Slides Voice & Speaker Notes Studio",
      author: "Dr. Victor Garcia Martinez",
      totalDecks: allDecks.length,
      totalSlidesAllDecks: allDecks.reduce((sum, d) => sum + d.totalSlides, 0),
      decks: allDecks,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(combinedData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "all_curriculum_speaker_notes_432_slides.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSlide, handlePrevSlide]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        lecture={lecture}
        activeDeckId={activeDeckId}
        onSelectDeck={handleSelectDeck}
        activeSlideNumber={activeSlide?.slideNumber || 1}
        onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
        onOpenPythonScript={() => setIsPythonModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onExportJson={handleExportJson}
        onExportAllJson={handleExportAllJson}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Slide List Drawer */}
        <SlideListDrawer
          slides={lecture.slides}
          activeSlideId={activeSlide?.id || 1}
          onSelectSlide={handleSelectSlide}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isPlaying={isPlaying}
        />

        {/* Slide Viewer */}
        <SlideViewer
          slide={activeSlide}
          isPlaying={isPlaying}
          isPaused={isPaused}
          spokenCharIndex={spokenCharIndex}
          onPlay={handlePlayActiveSlide}
          onPause={pause}
          onResume={resume}
          onUpdateNarration={handleUpdateNarration}
        />
      </main>

      {/* Persistent Audio Controller Bar */}
      {activeSlide && (
        <AudioPlayerBar
          currentSlide={activeSlide}
          isPlaying={isPlaying}
          isPaused={isPaused}
          onPlay={handlePlayActiveSlide}
          onPause={pause}
          onResume={resume}
          onStop={stop}
          onNextSlide={handleNextSlide}
          onPrevSlide={handlePrevSlide}
          voices={voices}
          selectedVoice={selectedVoice}
          onSelectVoice={setSelectedVoice}
          rate={rate}
          onRateChange={setRate}
          autoAdvance={autoAdvance}
          onToggleAutoAdvance={setAutoAdvance}
          hasNext={activeSlideIndex < lecture.slides.length - 1}
          hasPrev={activeSlideIndex > 0}
          spokenCharIndex={spokenCharIndex}
        />
      )}

      {/* Google Apps Script Modal */}
      <GoogleAppsScriptModal
        isOpen={isAppsScriptModalOpen}
        onClose={() => setIsAppsScriptModalOpen(false)}
        lecture={lecture}
      />

      {/* Python Script Modal */}
      <PythonScriptModal
        isOpen={isPythonModalOpen}
        onClose={() => setIsPythonModalOpen(false)}
        lecture={lecture}
      />

      {/* Custom File Upload / Deck Select Modal */}
      <CustomFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onLoadCustomSlides={handleLoadCustomSlides}
        onResetToSample={handleResetToSample}
        onSelectPreloadedDeck={handleSelectDeck}
      />
    </div>
  );
}
