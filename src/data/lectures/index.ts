import { LectureData } from '../../types';
import { parseNarrationScript } from '../../utils/parser';
import { RAW_N1_DAY1 } from './rawN1Day1';
import { RAW_N1_DAY2 } from './rawN1Day2';
import { RAW_N1_DAY3 } from './rawN1Day3';
import { RAW_N1_DAY4 } from './rawN1Day4';
import { RAW_N3_DAY1 } from './rawN3Day1';
import { RAW_N3_DAY2 } from './rawN3Day2';
import { RAW_N3_DAY3 } from './rawN3Day3';
import { RAW_N3_DAY4 } from './rawN3Day4';

import { RAW_N1_DAY1_ES } from './rawN1Day1_es';
import { RAW_N1_DAY2_ES } from './rawN1Day2_es';
import { RAW_N1_DAY3_ES } from './rawN1Day3_es';
import { RAW_N1_DAY4_ES } from './rawN1Day4_es';
import { RAW_N3_DAY1_ES } from './rawN3Day1_es';
import { RAW_N3_DAY2_ES } from './rawN3Day2_es';
import { RAW_N3_DAY3_ES } from './rawN3Day3_es';
import { RAW_N3_DAY4_ES } from './rawN3Day4_es';

export interface LectureDeckMeta {
  id: string;
  baseId: string;
  course: 'Nursing 1' | 'Nursing 3';
  day: string;
  title: string;
  subtitle: string;
  author: string;
  language: 'en' | 'es';
  colorScheme: 'indigo' | 'violet' | 'sky' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'teal';
  rawText: string;
}

export const LECTURE_DECKS_METADATA: LectureDeckMeta[] = [
  // ── English Decks ──────────────────────────────────────────────────────────
  {
    id: 'n1-day1',
    baseId: 'n1-day1',
    course: 'Nursing 1',
    day: 'Day 1',
    title: 'Reproductive Health, Contraception & Preconception Genetics',
    subtitle: 'Hormonal regulation, dysmenorrhea, menopause, LARC methods, and inheritance',
    author: 'Dr. Victor Garcia Martinez',
    language: 'en',
    colorScheme: 'indigo',
    rawText: RAW_N1_DAY1,
  },
  {
    id: 'n1-day2',
    baseId: 'n1-day2',
    course: 'Nursing 1',
    day: 'Day 2',
    title: 'Fetal Development & Antenatal Assessment',
    subtitle: 'Embryology, fetal shunts, GTPAL, Naegele rule, and baseline prenatal exam',
    author: 'Dr. Victor Garcia Martinez',
    language: 'en',
    colorScheme: 'violet',
    rawText: RAW_N1_DAY2,
  },
  {
    id: 'n1-day3',
    baseId: 'n1-day3',
    course: 'Nursing 1',
    day: 'Day 3',
    title: 'Supporting Everyday Health in Pregnancy',
    subtitle: 'Nutrition, common discomforts, hyperemesis, PLLR medication safety, and Rubin tasks',
    author: 'Dr. Victor Garcia Martinez',
    language: 'en',
    colorScheme: 'emerald',
    rawText: RAW_N1_DAY3,
  },
  {
    id: 'n1-day4',
    baseId: 'n1-day4',
    course: 'Nursing 1',
    day: 'Day 4',
    title: 'Antepartum Surveillance, Screening & Diagnostic Testing',
    subtitle: 'Cell-free DNA, Quad screen, CVS, amniocentesis, NST, BPP, and bioethics',
    author: 'Dr. Victor Garcia Martinez',
    language: 'en',
    colorScheme: 'sky',
    rawText: RAW_N1_DAY4,
  },
  {
    id: 'n3-day1',
    baseId: 'n3-day1',
    course: 'Nursing 3',
    day: 'Day 1',
    title: 'Early & Late Bleeding, Abortion, Hyperemesis & PPH',
    subtitle: 'Ectopic rupture, molar pregnancy, previa vs abruption, DIC, and the 4 Ts',
    author: 'Dr. Victor Garcia Martinez',
    language: 'en',
    colorScheme: 'rose',
    rawText: RAW_N3_DAY1,
  },
  {
    id: 'n3-day2',
    baseId: 'n3-day2',
    course: 'Nursing 3',
    day: 'Day 2',
    title: 'High-Risk Pregnancy: Hypertensive Disorders, GDM & PROM',
    subtitle: 'Preeclampsia, magnesium safety, HELLP syndrome, GDM targets, and PPROM management',
    author: 'Dr. Victor Garcia Martinez',
    language: 'en',
    colorScheme: 'amber',
    rawText: RAW_N3_DAY2,
  },
  {
    id: 'n3-day3',
    baseId: 'n3-day3',
    course: 'Nursing 3',
    day: 'Day 3',
    title: 'Dysfunctional Labor, Dystocia, Induction & Emergencies',
    subtitle: 'The 5 Ps, shoulder dystocia, Bishop score, oxytocin safety, and cord prolapse',
    author: 'Dr. Victor Garcia Martinez',
    language: 'en',
    colorScheme: 'cyan',
    rawText: RAW_N3_DAY3,
  },
  {
    id: 'n3-day4',
    baseId: 'n3-day4',
    course: 'Nursing 3',
    day: 'Day 4',
    title: 'Compromised Newborns, Resuscitation & Perinatal Loss',
    subtitle: 'Birth injuries, hyperbilirubinemia, NRP ventilation, fetal monitoring, and grief care',
    author: 'Dr. Victor Garcia Martinez',
    language: 'en',
    colorScheme: 'teal',
    rawText: RAW_N3_DAY4,
  },

  // ── Spanish Decks (Versiones en Español) ───────────────────────────────────
  {
    id: 'n1-day1-es',
    baseId: 'n1-day1',
    course: 'Nursing 1',
    day: 'Día 1',
    title: 'Salud reproductiva, anticoncepción y genética preconcepcional',
    subtitle: 'Regulación hormonal, dismenorrea, menopausia, métodos LARC y patrones de herencia',
    author: 'Dr. Victor Garcia Martinez',
    language: 'es',
    colorScheme: 'indigo',
    rawText: RAW_N1_DAY1_ES,
  },
  {
    id: 'n1-day2-es',
    baseId: 'n1-day2',
    course: 'Nursing 1',
    day: 'Día 2',
    title: 'Desarrollo fetal y evaluación antenatal',
    subtitle: 'Embriología, derivaciones fetales, GTPAL, regla de Naegele y examen prenatal inicial',
    author: 'Dr. Victor Garcia Martinez',
    language: 'es',
    colorScheme: 'violet',
    rawText: RAW_N1_DAY2_ES,
  },
  {
    id: 'n1-day3-es',
    baseId: 'n1-day3',
    course: 'Nursing 1',
    day: 'Día 3',
    title: 'Apoyo a la salud cotidiana en el embarazo',
    subtitle: 'Nutrición, molestias comunes, hiperémesis gravídica, seguridad farmacológica PLLR y tareas de Rubin',
    author: 'Dr. Victor Garcia Martinez',
    language: 'es',
    colorScheme: 'emerald',
    rawText: RAW_N1_DAY3_ES,
  },
  {
    id: 'n1-day4-es',
    baseId: 'n1-day4',
    course: 'Nursing 1',
    day: 'Día 4',
    title: 'Vigilancia anteparto, tamizaje y pruebas diagnósticas',
    subtitle: 'ADN fetal libre, cuádruple marcador, biopsia de vellosidades coriónicas, amniocentesis, NST y PBF',
    author: 'Dr. Victor Garcia Martinez',
    language: 'es',
    colorScheme: 'sky',
    rawText: RAW_N1_DAY4_ES,
  },
  {
    id: 'n3-day1-es',
    baseId: 'n3-day1',
    course: 'Nursing 3',
    day: 'Día 1',
    title: 'Sangrado temprano y tardío, aborto, hiperémesis y hemorragia posparto',
    subtitle: 'Rotura ectópica, embarazo molar, placenta previa vs desprendimiento, CID y las 4 T',
    author: 'Dr. Victor Garcia Martinez',
    language: 'es',
    colorScheme: 'rose',
    rawText: RAW_N3_DAY1_ES,
  },
  {
    id: 'n3-day2-es',
    baseId: 'n3-day2',
    course: 'Nursing 3',
    day: 'Día 2',
    title: 'Embarazo de alto riesgo: Trastornos hipertensivos, DMG y RPM pretérmino',
    subtitle: 'Preeclampsia, sulfato de magnesio, síndrome HELLP, objetivos de DMG y manejo de RPM pretérmino',
    author: 'Dr. Victor Garcia Martinez',
    language: 'es',
    colorScheme: 'amber',
    rawText: RAW_N3_DAY2_ES,
  },
  {
    id: 'n3-day3-es',
    baseId: 'n3-day3',
    course: 'Nursing 3',
    day: 'Día 3',
    title: 'Trabajo de parto disfuncional, distocia, inducción y emergencias',
    subtitle: 'Las 5 P, distocia de hombros, puntuación de Bishop, seguridad con oxitocina y prolapso de cordón',
    author: 'Dr. Victor Garcia Martinez',
    language: 'es',
    colorScheme: 'cyan',
    rawText: RAW_N3_DAY3_ES,
  },
  {
    id: 'n3-day4-es',
    baseId: 'n3-day4',
    course: 'Nursing 3',
    day: 'Día 4',
    title: 'Emergencias intraparto, complicaciones del trabajo de parto y reanimación neonatal',
    subtitle: 'Distocia de hombros, prolapso de cordón, rotura uterina, embolia de líquido amniótico y algoritmo PRN',
    author: 'Dr. Victor Garcia Martinez',
    language: 'es',
    colorScheme: 'teal',
    rawText: RAW_N3_DAY4_ES,
  },
];

// Cache parsed lectures
const parsedLecturesMap: Record<string, LectureData> = {};

export function getLectureById(id: string): LectureData {
  if (parsedLecturesMap[id]) {
    return parsedLecturesMap[id];
  }

  const meta = LECTURE_DECKS_METADATA.find(d => d.id === id) || LECTURE_DECKS_METADATA[0];
  const slides = parseNarrationScript(meta.rawText);
  const totalWords = slides.reduce((acc, s) => acc + s.wordCount, 0);
  const totalSeconds = slides.reduce((acc, s) => acc + s.estimatedSeconds, 0);

  const courseLabel = meta.language === 'es'
    ? `${meta.course === 'Nursing 1' ? 'Enfermería 1' : 'Enfermería 3'} | ${meta.day}`
    : `${meta.course} | ${meta.day}`;

  const lecture: LectureData = {
    title: meta.title,
    course: courseLabel,
    author: meta.author,
    totalSlides: slides.length,
    totalWords,
    estimatedMinutes: Math.round(totalSeconds / 60),
    slides,
    language: meta.language,
  };

  parsedLecturesMap[id] = lecture;
  return lecture;
}

export function getCorrespondingDeckId(deckId: string, targetLanguage: 'en' | 'es'): string {
  const currentMeta = LECTURE_DECKS_METADATA.find(d => d.id === deckId);
  if (!currentMeta) return targetLanguage === 'es' ? 'n1-day1-es' : 'n1-day1';
  
  const baseId = currentMeta.baseId;
  const match = LECTURE_DECKS_METADATA.find(d => d.baseId === baseId && d.language === targetLanguage);
  return match ? match.id : deckId;
}

export function getAllDeckSummaries(language?: 'en' | 'es') {
  const filtered = language 
    ? LECTURE_DECKS_METADATA.filter(d => d.language === language)
    : LECTURE_DECKS_METADATA;

  return filtered.map((meta) => {
    const lecture = getLectureById(meta.id);
    return {
      ...meta,
      slideCount: lecture.totalSlides,
      wordCount: lecture.totalWords,
      estimatedMinutes: lecture.estimatedMinutes,
    };
  });
}
