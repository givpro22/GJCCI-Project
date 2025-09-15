import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { POSE_TASK_URL, WASM_URL } from './constants';

export async function createPoseLandmarker() {
  const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
  const landmarker = await PoseLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: POSE_TASK_URL },
    runningMode: 'VIDEO',
    numPoses: 10,
    minPoseDetectionConfidence: 0.5,
    minPosePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  return landmarker;
}

export async function detectForVideo(landmarker: PoseLandmarker, video: HTMLVideoElement) {
  const nowMs = performance.now();
  return landmarker.detectForVideo(video, nowMs);
}
