import type { PersonBox, Landmarks } from '../model/types';
import { SHOULDER_MARGIN } from './constants';
import { computeBBox, angle } from './geometry';

const INDEX = {
  l_shoulder: 11,
  r_shoulder: 12,
  l_elbow: 13,
  r_elbow: 14,
  l_wrist: 15,
  r_wrist: 16,
} as const;

export function landmarksToPersons(
  all: Landmarks[],
  canvasW: number,
  canvasH: number,
): PersonBox[] {
  const persons: PersonBox[] = [];

  for (const lm of all) {
    if (!lm?.length) continue;

    const bbox = computeBBox(lm, canvasW, canvasH);
    const get = (name: keyof typeof INDEX) => lm[INDEX[name]];

    const lSh = get('l_shoulder');
    const rSh = get('r_shoulder');
    const lEl = get('l_elbow');
    const rEl = get('r_elbow');
    const lWr = get('l_wrist');
    const rWr = get('r_wrist');

    const ly = lWr?.y ?? 1;
    const lsy = lSh?.y ?? 1;
    const ry = rWr?.y ?? 1;
    const rsy = rSh?.y ?? 1;

    const leftUp = lWr && lSh ? ly < lsy - SHOULDER_MARGIN : false;
    const rightUp = rWr && rSh ? ry < rsy - SHOULDER_MARGIN : false;

    const leftAngle = angle(lSh, lEl, lWr);
    const rightAngle = angle(rSh, rEl, rWr);
    const leftExtended = leftAngle > 150;
    const rightExtended = rightAngle > 150;

    const leftRaised = leftUp && leftExtended;
    const rightRaised = rightUp && rightExtended;

    persons.push({
      id: -1,
      bbox,
      leftRaised,
      rightRaised,
      raised: leftRaised || rightRaised,
    });
  }

  return persons;
}
