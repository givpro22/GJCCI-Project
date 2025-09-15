import type { PersonBox } from '../model/types';

export function drawOverlay(ctx: CanvasRenderingContext2D, persons: PersonBox[]) {
  ctx.lineWidth = 2;

  for (const p of persons) {
    ctx.strokeStyle = p.raised ? 'lime' : 'rgba(255,255,255,0.7)';
    ctx.strokeRect(p.bbox.x, p.bbox.y, p.bbox.w, p.bbox.h);

    const badgeX = p.bbox.x + p.bbox.w / 2;
    const badgeY = Math.max(10, p.bbox.y - 12);
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 10, 0, Math.PI * 2);
    ctx.fillStyle =
      p.leftRaised && p.rightRaised
        ? 'gold'
        : p.leftRaised
          ? 'deepskyblue'
          : p.rightRaised
            ? 'springgreen'
            : 'rgba(255,255,255,0.5)';
    ctx.fill();

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#000';
    ctx.fillText(`#${p.id}${p.raised ? ' ✋' : ''}`, badgeX + 14, badgeY + 4);
  }
}
