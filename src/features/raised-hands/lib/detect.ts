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

    // Estimated geometry from bbox for occlusion cases (y: 0 top → 1 bottom)
    const h = bbox.h;
    const top = bbox.y;
    // Make shoulder/head estimates more permissive (lower lines → easier to satisfy "above")
    const shoulderYEst = lSh?.y ?? rSh?.y ?? top + 0.35 * h;
    const headYEst = Math.min(lSh?.y ?? 1, rSh?.y ?? 1, top + 0.2 * h);

    // Margins: strict vs loose (looser threshold)
    const marginStrict = SHOULDER_MARGIN;
    const marginLoose = Math.max(SHOULDER_MARGIN * 0.3, 0.01);

    // Strict: wrist clearly above its shoulder by strict margin
    const leftUpStrict = lWr && lSh ? ly < lsy - marginStrict : false;
    const rightUpStrict = rWr && rSh ? ry < rsy - marginStrict : false;

    // Loose: accept if wrist is above estimated shoulder line (even if shoulder is occluded)
    //        or roughly near/above head region
    const leftUpLoose =
      !!lWr && ((lSh ? ly < lsy - marginLoose : ly < shoulderYEst - marginLoose) || ly < headYEst);
    const rightUpLoose =
      !!rWr && ((rSh ? ry < rsy - marginLoose : ry < shoulderYEst - marginLoose) || ry < headYEst);

    // Elbow angle: if unavailable (occluded), treat as "loose-extended"
    const leftAngle = angle(lSh, lEl, lWr);
    const rightAngle = angle(rSh, rEl, rWr);
    const leftExtendedStrict = leftAngle > 30;
    const rightExtendedStrict = rightAngle > 30;
    // Much looser acceptance; or if angle is missing, accept.
    const leftExtendedLoose = Number.isFinite(leftAngle) ? leftAngle > 100 : true;
    const rightExtendedLoose = Number.isFinite(rightAngle) ? rightAngle > 100 : true;

    // If wrist is clearly above head line by a small margin, accept regardless of elbow angle.
    const leftVeryHigh = !!lWr && ly < headYEst - 0.02;
    const rightVeryHigh = !!rWr && ry < headYEst - 0.02;

    // Final decision:
    //  - strict rule (as before)
    //  - OR loose rule
    //  - OR "veryHigh" shortcut (wrist well above head)
    const leftRaised =
      (leftUpStrict && leftExtendedStrict) || leftVeryHigh || (leftUpLoose && leftExtendedLoose);
    const rightRaised =
      (rightUpStrict && rightExtendedStrict) ||
      rightVeryHigh ||
      (rightUpLoose && rightExtendedLoose);

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
