import { SlideItem, LectureData } from '../types';

export function parseNarrationScript(rawScript: string): SlideItem[] {
  const lines = rawScript.split('\n');
  const slides: SlideItem[] = [];
  let currentSlide: Partial<SlideItem> | null = null;
  let currentNarrationLines: string[] = [];

  // Support "Slide 1 — Title", "Diapositiva 1 — Title", and markdown headers like "# Diapositiva 1 — Title"
  const slideHeaderRegex = /^(?:#+\s*)?(?:Slide|Diapositiva)\s+(\d+)(?:\s*[:—–-]\s*(.*))?$/i;

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
  if (lower.includes('self-check') || lower.includes('autoverificación') || lower.includes('pregunta') || lower.includes('exit ticket') || lower.includes('review') || lower.includes('active recall')) return 'Review & Self-Check';
  if (lower.includes('case') || lower.includes('caso') || lower.includes('ngn') || lower.includes('escenario') || lower.includes('sarah') || lower.includes('maria') || lower.includes('linda') || lower.includes('denise') || lower.includes('grace') || lower.includes('amelia') || lower.includes('leah') || lower.includes('bianca') || lower.includes('jordan') || lower.includes('monica') || lower.includes('sally') || lower.includes('tanya') || lower.includes('clara') || lower.includes('devon') || lower.includes('alicia') || lower.includes('brenda') || lower.includes('priya') || lower.includes('aisha')) return 'Case Study / NGN';
  if (lower.includes('closing') || lower.includes('cierre') || lower.includes('takeaway') || lower.includes('conclusiones') || lower.includes('synthesis') || lower.includes('síntesis') || lower.includes('summary') || lower.includes('resumen')) return 'Synthesis & Takeaways';
  if (lower.includes('bleeding') || lower.includes('hemorragia') || lower.includes('sangrado') || lower.includes('abortion') || lower.includes('aborto') || lower.includes('previa') || lower.includes('abruption') || lower.includes('desprendimiento') || lower.includes('dic') || lower.includes('cid')) return 'Obstetric Hemorrhage & Bleeding';
  if (lower.includes('hypertens') || lower.includes('hipertens') || lower.includes('preeclampsia') || lower.includes('hellp') || lower.includes('magnesium') || lower.includes('magnesio') || lower.includes('eclampsia')) return 'Hypertensive Disorders';
  if (lower.includes('diabetes') || lower.includes('gdm') || lower.includes('glucose') || lower.includes('glucosa') || lower.includes('insulin') || lower.includes('insulina')) return 'Gestational Diabetes';
  if (lower.includes('preterm') || lower.includes('pretérmino') || lower.includes('prematur') || lower.includes('prom') || lower.includes('rpm') || lower.includes('cerclage') || lower.includes('cerclaje') || lower.includes('cervical')) return 'Preterm Labor & Membranes';
  if (lower.includes('dystocia') || lower.includes('distocia') || lower.includes('labor') || lower.includes('parto') || lower.includes('induction') || lower.includes('inducción') || lower.includes('oxytocin') || lower.includes('oxitocina') || lower.includes('shoulder') || lower.includes('hombros') || lower.includes('cordón') || lower.includes('cord')) return 'Intrapartum & Dystocia';
  if (lower.includes('newborn') || lower.includes('neonato') || lower.includes('recién nacido') || lower.includes('resuscitation') || lower.includes('reanimación') || lower.includes('prn') || lower.includes('nrp') || lower.includes('jaundice') || lower.includes('ictericia') || lower.includes('bilirubin') || lower.includes('sepsis') || lower.includes('pérdida')) return 'Newborn & Resuscitation';
  if (lower.includes('dysmenorrhea') || lower.includes('dismenorrea') || lower.includes('prostaglandin') || lower.includes('dolor')) return 'Menstrual & Dysmenorrhea';
  if (lower.includes('menopause') || lower.includes('menopausia') || lower.includes('estrogen') || lower.includes('estrógeno')) return 'Menopause Transition';
  if (lower.includes('contracep') || lower.includes('anticoncep') || lower.includes('iud') || lower.includes('diu') || lower.includes('larc') || lower.includes('parche')) return 'Contraceptive Counseling';
  if (lower.includes('preconception') || lower.includes('preconcepcional') || lower.includes('genetics') || lower.includes('genética') || lower.includes('herencia')) return 'Preconception & Genetics';
  if (lower.includes('nutrition') || lower.includes('nutrición') || lower.includes('discomfort') || lower.includes('molestias') || lower.includes('hiperémesis') || lower.includes('hyperemesis')) return 'Maternal Nutrition & Wellness';
  if (lower.includes('surveillance') || lower.includes('vigilancia') || lower.includes('screening') || lower.includes('tamizaje') || lower.includes('ultrasound') || lower.includes('ecografía') || lower.includes('amniocentesis') || lower.includes('nst')) return 'Antepartum Surveillance';
  return 'Physiology & Clinical Care';
}
