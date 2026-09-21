export interface SlideItem {
  id: number;
  slideNumber: number;
  title: string;
  narration: string;
  slideContent?: string;
  wordCount: number;
  estimatedSeconds: number;
  category?: string;
}

export interface LectureData {
  title: string;
  course: string;
  author: string;
  totalSlides: number;
  totalWords: number;
  estimatedMinutes: number;
  slides: SlideItem[];
}

export interface VoiceSettings {
  voiceURI: string;
  rate: number;
  pitch: number;
  volume: number;
  autoAdvance: boolean;
}
