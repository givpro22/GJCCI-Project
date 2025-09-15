import { useEffect, useRef, useState } from 'react';
import type { PersonBox, Landmarks } from '../model/types';
import { createPoseLandmarker, detectForVideo } from './pose';
import { landmarksToPersons } from './detect';
import { matchPersons } from './match';
import { VIDEO_CONSTRAINTS } from './constants';
import { drawOverlay } from './draw';

export function useRaisedHands() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const landmarkerRef =
    useRef<ReturnType<typeof createPoseLandmarker> extends Promise<infer T> ? T : any | null>(null);

  const idSeed = useRef(0);
  const lastBoxes = useRef<PersonBox[]>([]);
  const rafId = useRef<number | null>(null);
  const stopLoop = useRef<() => void>(() => {});
  const [anyRaised, setAnyRaised] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    let running = true;

    (async () => {
      try {
        // 1) pose landmarker
        landmarkerRef.current = await createPoseLandmarker();

        // 2) camera
        const stream = await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS);
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;

        await new Promise<void>((resolve) => {
          if (video.readyState >= 1 && video.videoWidth > 0) return resolve();
          video.addEventListener('loadedmetadata', () => resolve(), { once: true });
        });
        await video.play();

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        const resizeIfNeeded = () => {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }
        };

        // 3) loop (RVFC 우선)
        const hasRVFC = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;
        if (hasRVFC) {
          const cb = async () => {
            if (!running) return;
            try {
              resizeIfNeeded();
              await processFrame(video, canvas, ctx);
            } catch (e) {
              console.error(e);
            }
            (video as any).requestVideoFrameCallback(cb);
          };
          (video as any).requestVideoFrameCallback(cb);
          stopLoop.current = () => {};
        } else {
          const loop = async () => {
            if (!running) return;
            try {
              resizeIfNeeded();
              await processFrame(video, canvas, ctx);
            } catch (e) {
              console.error(e);
            }
            rafId.current = requestAnimationFrame(loop);
          };
          loop();
          stopLoop.current = () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
          };
        }
      } catch (err: any) {
        console.error('[useRaisedHands] init error', err);
        setErrMsg(err?.message ?? '초기화 실패: 카메라 권한/HTTPS, 모델·WASM 경로를 확인하세요.');
      }
    })();

    return () => {
      running = false;
      try {
        stopLoop.current();
        landmarkerRef.current?.close();
      } catch {}
      const tracks = (videoRef.current?.srcObject as MediaStream | undefined)?.getTracks?.();
      tracks?.forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processFrame = async (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) => {
    const landmarker = landmarkerRef.current;
    if (!landmarker) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const result = await detectForVideo(landmarker, video);
    const landmarks: Landmarks[] = result?.landmarks || [];

    if (!landmarks.length) {
      setAnyRaised(false);
      return;
    }

    const current = landmarksToPersons(landmarks, canvas.width, canvas.height);
    const matched = matchPersons(lastBoxes.current, current, idSeed);
    lastBoxes.current = matched;

    drawOverlay(ctx, matched);
    setAnyRaised(matched.some((m) => m.raised));
  };

  return { videoRef, canvasRef, anyRaised, errMsg };
}
