import { useEffect, useMemo, useRef, useState } from 'react';

export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [flash, setFlash] = useState(false);
  const beepRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        if (next <= 0) {
          setRunning(false);
          setFlash(true);
          setTimeout(() => {
            try {
              if (beepRef.current) {
                beepRef.current.currentTime = 0;
                beepRef.current.play().catch(() => {});
              }
            } catch {}
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('타이머 완료', { body: '설정한 시간이 완료되었습니다.' });
            }
          }, 0);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, remaining]);

  useEffect(() => {
    if (!flash) return;
    const originalBg = document.body.style.backgroundColor;
    let count = 0;
    const id = setInterval(() => {
      document.body.style.backgroundColor =
        document.body.style.backgroundColor === 'red' ? originalBg : 'red';
      count++;
      if (count >= 6) {
        clearInterval(id);
        document.body.style.backgroundColor = originalBg;
        setFlash(false);
      }
    }, 500);
    return () => {
      clearInterval(id);
      document.body.style.backgroundColor = originalBg;
    };
  }, [flash]);

  const mmss = useMemo(() => {
    const m = Math.floor(remaining / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(remaining % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  }, [remaining]);

  function ensureNotifyPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }

  function setPreset(min: number) {
    const total = Math.max(0, Math.round(min * 60));
    setSeconds(total);
    setRemaining(total);
    setRunning(false);
    ensureNotifyPermission();
  }

  function setCustom() {
    const v = window.prompt('타이머 시간을 입력하세요 (예: 25, 10:00, 1:30)');
    if (!v) return;
    const parts = v.split(':');
    let total = 0;
    if (parts.length === 1) {
      const min = Number(parts[0]);
      if (Number.isFinite(min) && min >= 0) total = Math.round(min * 60);
    } else if (parts.length === 2) {
      const min = Number(parts[0]);
      const sec = Number(parts[1]);
      if (Number.isFinite(min) && Number.isFinite(sec) && min >= 0 && sec >= 0) {
        total = Math.round(min * 60 + sec);
      }
    }
    if (total > 0) {
      setSeconds(total);
      setRemaining(total);
      setRunning(false);
      ensureNotifyPermission();
    } else {
      alert('입력 형식이 올바르지 않습니다.');
    }
  }

  function toggle() {
    if (remaining <= 0 && seconds > 0) setRemaining(seconds);
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setRemaining(seconds);
  }

  return {
    mmss,
    seconds,
    remaining,
    running,
    setPreset,
    setCustom,
    toggle,
    reset,
    beepRef,
  };
}
