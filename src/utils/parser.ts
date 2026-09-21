import { SlideItem, LectureData } from '../types';

export function parseNarrationScript(rawScript: string): SlideItem[] {
  const lines = rawScript.split('\n');
  const slides: SlideItem[] = [];
  let currentSlide: Partial<SlideItem> | null = null;
  let currentNarrationLines: string[] = [];

  const slideHeaderRegex = /^Slide\s+(\d+)(?:\s*[:—–-]\s*(.*))?$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(slideHeaderRegex);

    if (match) {
      if (currentSlide && currentSlide.slideNumber) {
        const narrationText = currentNarrationLines.join('\n').trim();
        const wordCount = narrationText ? narrationText.split(/\s+/).filter(Boolean).length : 0;
        slides.push({
          id: currentSlide.slideNumber,
          slideNumber: currentSlide.slideNumber,
          title: currentSlide.title || `Slide ${currentSlide.slideNumber}`,
          narration: narrationText,
          wordCount,
          estimatedSeconds: Math.round((wordCount / 130) * 60),
          category: categorizeSlide(currentSlide.slideNumber, currentSlide.title || '')
        });
      }

      const num = parseInt(match[1], 10);
      const title = (match[2] || `Slide ${num}`).trim();
      currentSlide = {
        slideNumber: num,
        title: title
      };
      currentNarrationLines = [];
    } else if (currentSlide) {
      if (line.length > 0) {
        currentNarrationLines.push(line);
      }
    }
  }

  // Push final slide
  if (currentSlide && currentSlide.slideNumber) {
    const narrationText = currentNarrationLines.join('\n').trim();
    const wordCount = narrationText ? narrationText.split(/\s+/).filter(Boolean).length : 0;
    slides.push({
      id: currentSlide.slideNumber,
      slideNumber: currentSlide.slideNumber,
      title: currentSlide.title || `Slide ${currentSlide.slideNumber}`,
      narration: narrationText,
      wordCount,
      estimatedSeconds: Math.round((wordCount / 130) * 60),
      category: categorizeSlide(currentSlide.slideNumber, currentSlide.title || '')
    });
  }

  return slides;
}

export function categorizeSlide(slideNum: number, title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('self-check') || lower.includes('exit ticket') || lower.includes('review') || lower.includes('active recall')) return 'Review & Self-Check';
  if (lower.includes('case') || lower.includes('ngn') || lower.includes('sarah') || lower.includes('maria') || lower.includes('linda') || lower.includes('denise') || lower.includes('grace') || lower.includes('amelia') || lower.includes('leah') || lower.includes('bianca') || lower.includes('jordan') || lower.includes('monica') || lower.includes('sally') || lower.includes('tanya') || lower.includes('clara') || lower.includes('devon') || lower.includes('alicia') || lower.includes('brenda') || lower.includes('priya') || lower.includes('aisha')) return 'Case Study / NGN';
  if (lower.includes('closing') || lower.includes('takeaway') || lower.includes('synthesis') || lower.includes('summary')) return 'Synthesis & Takeaways';
  if (lower.includes('bleeding') || lower.includes('abortion') || lower.includes('hemorrhage') || lower.includes('previa') || lower.includes('abruption') || lower.includes('dic')) return 'Obstetric Hemorrhage & Bleeding';
  if (lower.includes('hypertens') || lower.includes('preeclampsia') || lower.includes('hellp') || lower.includes('magnesium') || lower.includes('eclampsia')) return 'Hypertensive Disorders';
  if (lower.includes('diabetes') || lower.includes('gdm') || lower.includes('glucose') || lower.includes('insulin')) return 'Gestational Diabetes';
  if (lower.includes('preterm') || lower.includes('prom') || lower.includes('pprom') || lower.includes('cerclage') || lower.includes('cervical')) return 'Preterm Labor & Membranes';
  if (lower.includes('dystocia') || lower.includes('labor') || lower.includes('induction') || lower.includes('oxytocin') || lower.includes('shoulder') || lower.includes('rupture') || lower.includes('cord prolapse')) return 'Intrapartum & Dystocia';
  if (lower.includes('newborn') || lower.includes('resuscitation') || lower.includes('jaundice') || lower.includes('bilirubin') || lower.includes('sepsis') || lower.includes('trauma') || lower.includes('brachial') || lower.includes('loss')) return 'Newborn & Resuscitation';
  if (lower.includes('dysmenorrhea') || lower.includes('prostaglandin') || lower.includes('pain')) return 'Menstrual & Dysmenorrhea';
  if (lower.includes('menopause') || lower.includes('estrogen') || lower.includes('cardiovascular')) return 'Menopause Transition';
  if (lower.includes('contracep') || lower.includes('iud') || lower.includes('pill') || lower.includes('larc') || lower.includes('aches') || lower.includes('patch')) return 'Contraceptive Counseling';
  if (lower.includes('preconception') || lower.includes('genetics') || lower.includes('inheritance') || lower.includes('valproate')) return 'Preconception & Genetics';
  if (lower.includes('nutrition') || lower.includes('discomfort') || lower.includes('vomiting') || lower.includes('hyperemesis')) return 'Maternal Nutrition & Wellness';
  if (lower.includes('surveillance') || lower.includes('screening') || lower.includes('ultrasound') || lower.includes('amniocentesis') || lower.includes('nonstress') || lower.includes('biophysical')) return 'Antepartum Surveillance';
  return 'Physiology & Clinical Care';
}
