import type { PersonBox } from '../model/types';
import { MATCH_DISTANCE } from './constants';

export function matchPersons(prev: PersonBox[], curr: PersonBox[], idSeed: { current: number }) {
  const usedPrev = new Set<number>();

  curr.forEach((c) => {
    const cx = c.bbox.x + c.bbox.w / 2;
    const cy = c.bbox.y + c.bbox.h / 2;
    let best = -1;
    let bestD = Number.POSITIVE_INFINITY;

    prev.forEach((p) => {
      if (usedPrev.has(p.id)) return;
      const px = p.bbox.x + p.bbox.w / 2;
      const py = p.bbox.y + p.bbox.h / 2;
      const d = Math.hypot(cx - px, cy - py);
      if (d < bestD) {
        bestD = d;
        best = p.id;
      }
    });

    if (best >= 0 && bestD < MATCH_DISTANCE) {
      c.id = best;
      usedPrev.add(best);
    } else {
      c.id = ++idSeed.current;
    }
  });

  return curr;
}
