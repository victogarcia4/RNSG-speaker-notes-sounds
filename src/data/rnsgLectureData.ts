import { LectureData } from '../types';
import { getLectureById } from './lectures';

export function getInitialLecture(): LectureData {
  return getLectureById('n1-day1');
}
