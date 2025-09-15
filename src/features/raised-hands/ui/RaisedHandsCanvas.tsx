import { memo } from 'react';
import { useRaisedHands } from '../lib/useRaisedHands';

export default memo(function RaisedHandsCanvas() {
  const { videoRef, canvasRef, anyRaised, errMsg } = useRaisedHands();

  return (
    <div className={`absolute bottom-4 right-4 w-1/2 max-w-md ${anyRaised ? 'flash-bg' : ''}`}>
      <video
        ref={videoRef}
        className='aspect-video w-full rounded-xl object-cover'
        muted
        playsInline
      />
      <canvas ref={canvasRef} className='pointer-events-none absolute inset-0 h-full w-full' />
      <div className='absolute left-2 top-2 z-10 rounded-md bg-white/80 px-2 py-1 text-sm'>
        {errMsg ? (
          <span className='text-red-600'>에러: {errMsg}</span>
        ) : anyRaised ? (
          '누군가 손 들었어요 👋'
        ) : (
          '대기 중'
        )}
      </div>
      <style>{`
        .flash-bg { animation: bgPulse 0.8s ease-out; }
        @keyframes bgPulse { 0% { box-shadow: 0 0 0 0 rgba(0,255,0,0.6); } 100% { box-shadow: 0 0 0 40px rgba(0,255,0,0); } }
      `}</style>
    </div>
  );
});
