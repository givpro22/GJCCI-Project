export const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6/wasm';

export const POSE_TASK_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';

// 손목이 어깨보다 위에 있는지 판정할 때의 여유(margin)
export const SHOULDER_MARGIN = 0.02;

// 동일인 매칭 시 허용 거리(px)
export const MATCH_DISTANCE = 200;

// 비디오 기본 해상도
export const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: { facingMode: 'user', width: 1280, height: 720 },
  audio: false,
};
