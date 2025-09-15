import type { Landmarks } from '../model/types';

export function computeBBox(lm: Landmarks, w: number, h: number) {
  const xs = lm.map((p) => p.x * w);
  const ys = lm.map((p) => p.y * h);
  const minX = Math.max(0, Math.min(...xs));
  const maxX = Math.min(w, Math.max(...xs));
  const minY = Math.max(0, Math.min(...ys));
  const maxY = Math.min(h, Math.max(...ys));
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export function angle(a?: any, b?: any, c?: any) {
  if (!a || !b || !c) return 180;
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const m1 = Math.hypot(v1.x, v1.y);
  const m2 = Math.hypot(v2.x, v2.y);
  const cos = Math.min(1, Math.max(-1, dot / (m1 * m2)));
  return (Math.acos(cos) * 180) / Math.PI;
}
