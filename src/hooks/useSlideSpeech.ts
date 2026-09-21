import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSlideSpeechOptions {
  onSlideComplete?: () => void;
  autoAdvance?: boolean;
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

  // Load available speech synthesis voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      
      // Auto-select a high-quality natural English voice if none selected
      if (!selectedVoice && available.length > 0) {
        const preferred = available.find(
          v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
        ) || available.find(v => v.lang.startsWith('en')) || available[0];
        
        setSelectedVoice(preferred || null);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoice]);

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
