import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSlideSpeechOptions {
  onSlideComplete?: () => void;
  autoAdvance?: boolean;
  preferredLanguage?: 'en' | 'es';
}

export function useSlideSpeech(options: UseSlideSpeechOptions = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [currentText, setCurrentText] = useState<string>('');
  const [spokenCharIndex, setSpokenCharIndex] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(options.autoAdvance ?? true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onSlideCompleteRef = useRef(options.onSlideComplete);
  onSlideCompleteRef.current = options.onSlideComplete;
  const lang = options.preferredLanguage || 'en';

  const findBestVoiceForLang = useCallback((availableVoices: SpeechSynthesisVoice[], targetLang: 'en' | 'es') => {
    if (!availableVoices.length) return null;
    const prefix = targetLang === 'es' ? 'es' : 'en';
    const matches = availableVoices.filter(v => v.lang.toLowerCase().startsWith(prefix));
    if (matches.length === 0) return availableVoices[0] || null;

    if (targetLang === 'es') {
      return (
        matches.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Monica') || v.name.includes('Paulina') || v.name.includes('Jorge') || v.name.includes('Helena')) ||
        matches[0]
      );
    } else {
      return (
        matches.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Jenny') || v.name.includes('Guy')) ||
        matches[0]
      );
    }
  }, []);

  // Load available speech synthesis voices & sync with preferred language
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      
      // If voice doesn't match preferred language or no voice selected, pick best
      setSelectedVoice((prev) => {
        if (!prev || !prev.lang.toLowerCase().startsWith(lang === 'es' ? 'es' : 'en')) {
          return findBestVoiceForLang(available, lang);
        }
        return prev;
      });
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [lang, findBestVoiceForLang]);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setSpokenCharIndex(0);
  }, []);

  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPlaying, isPaused]);

  const resume = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isPlaying && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPlaying, isPaused]);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (!text || text.trim().length === 0) {
      setIsPlaying(false);
      return;
    }

    setCurrentText(text);
    setSpokenCharIndex(0);

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onboundary = (event) => {
      if (event.name === 'word' || event.name === 'sentence') {
        setSpokenCharIndex(event.charIndex);
      }
    };

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setSpokenCharIndex(text.length);
      if (onSlideCompleteRef.current) {
        onSlideCompleteRef.current();
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [selectedVoice, rate, pitch]);

  return {
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
    setAutoAdvance
  };
}
