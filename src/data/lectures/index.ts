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

export interface LectureDeckMeta {
  id: string;
  course: 'Nursing 1' | 'Nursing 3';
  day: string;
  title: string;
  subtitle: string;
  author: string;
  colorScheme: 'indigo' | 'violet' | 'sky' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'teal';
  rawText: string;
}

export const LECTURE_DECKS_METADATA: LectureDeckMeta[] = [
  {
    id: 'n1-day1',
    course: 'Nursing 1',
    day: 'Day 1',
    title: 'Reproductive Health, Contraception & Preconception Genetics',
    subtitle: 'Hormonal regulation, dysmenorrhea, menopause, LARC methods, and inheritance',
    author: 'Dr. Victor Garcia Martinez',
    colorScheme: 'indigo',
    rawText: RAW_N1_DAY1,
  },
  {
    id: 'n1-day2',
    course: 'Nursing 1',
    day: 'Day 2',
    title: 'Fetal Development & Antenatal Assessment',
    subtitle: 'Embryology, fetal shunts, GTPAL, Naegele rule, and baseline prenatal exam',
    author: 'Dr. Victor Garcia Martinez',
    colorScheme: 'violet',
    rawText: RAW_N1_DAY2,
  },
  {
    id: 'n1-day3',
    course: 'Nursing 1',
    day: 'Day 3',
    title: 'Supporting Everyday Health in Pregnancy',
    subtitle: 'Nutrition, common discomforts, hyperemesis, PLLR medication safety, and Rubin tasks',
    author: 'Dr. Victor Garcia Martinez',
    colorScheme: 'emerald',
    rawText: RAW_N1_DAY3,
  },
  {
    id: 'n1-day4',
    course: 'Nursing 1',
    day: 'Day 4',
    title: 'Antepartum Surveillance, Screening & Diagnostic Testing',
    subtitle: 'Cell-free DNA, Quad screen, CVS, amniocentesis, NST, BPP, and bioethics',
    author: 'Dr. Victor Garcia Martinez',
    colorScheme: 'sky',
    rawText: RAW_N1_DAY4,
  },
  {
    id: 'n3-day1',
    course: 'Nursing 3',
    day: 'Day 1',
    title: 'Early & Late Bleeding, Abortion, Hyperemesis & PPH',
    subtitle: 'Ectopic rupture, molar pregnancy, previa vs abruption, DIC, and the 4 Ts',
    author: 'Dr. Victor Garcia Martinez',
    colorScheme: 'rose',
    rawText: RAW_N3_DAY1,
  },
  {
    id: 'n3-day2',
    course: 'Nursing 3',
    day: 'Day 2',
    title: 'High-Risk Pregnancy: Hypertensive Disorders, GDM & PROM',
    subtitle: 'Preeclampsia, magnesium safety, HELLP syndrome, GDM targets, and PPROM management',
    author: 'Dr. Victor Garcia Martinez',
    colorScheme: 'amber',
    rawText: RAW_N3_DAY2,
  },
  {
    id: 'n3-day3',
    course: 'Nursing 3',
    day: 'Day 3',
    title: 'Dysfunctional Labor, Dystocia, Induction & Emergencies',
    subtitle: 'The 5 Ps, shoulder dystocia, Bishop score, oxytocin safety, and cord prolapse',
    author: 'Dr. Victor Garcia Martinez',
    colorScheme: 'cyan',
    rawText: RAW_N3_DAY3,
  },
  {
    id: 'n3-day4',
    course: 'Nursing 3',
    day: 'Day 4',
    title: 'Compromised Newborns, Resuscitation & Perinatal Loss',
    subtitle: 'Birth injuries, hyperbilirubinemia, NRP ventilation, fetal monitoring, and grief care',
    author: 'Dr. Victor Garcia Martinez',
    colorScheme: 'teal',
    rawText: RAW_N3_DAY4,
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

  const lecture: LectureData = {
    title: meta.title,
    course: `${meta.course} | ${meta.day}`,
    author: meta.author,
    totalSlides: slides.length,
    totalWords,
    estimatedMinutes: Math.round(totalSeconds / 60),
    slides,
  };

  parsedLecturesMap[id] = lecture;
  return lecture;
}

export function getAllDeckSummaries() {
  return LECTURE_DECKS_METADATA.map((meta) => {
    const lecture = getLectureById(meta.id);
    return {
      ...meta,
      slideCount: lecture.totalSlides,
      wordCount: lecture.totalWords,
      estimatedMinutes: lecture.estimatedMinutes,
    };
  });
}
