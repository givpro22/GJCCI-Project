import { useEffect, useMemo, useRef, useState } from 'react';

import { HeroSection } from '@/widgets/HeroSection';

function TimeTools() {
  return (
    <section className='mx-auto w-full max-w-5xl px-4 py-10'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <NaverLikeClock />
        <TimerCard />
      </div>
    </section>
  );
}

// 네이버 시계 느낌의 라이브 클록 (KST 고정)
function NaverLikeClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { dateStr, timeStr, weekdayStr } = useMemo(() => {
    const kst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const dateStr = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(kst);
    const weekdayStr = new Intl.DateTimeFormat('ko-KR', {
      weekday: 'long',
    }).format(kst);
    const timeStr = new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(kst);
    return { dateStr, timeStr, weekdayStr };
  }, [now]);

  return (
    <div className='rounded-xl border bg-white/70 p-6 shadow-sm backdrop-blur dark:bg-neutral-900/70'>
      <div className='text-sm text-neutral-500 dark:text-neutral-400'>대한민국 표준시 (KST)</div>
      <div className='mt-2 text-xl font-medium'>
        {dateStr} · {weekdayStr}
      </div>
      <div className='mt-3 text-5xl font-bold tabular-nums tracking-widest md:text-6xl'>
        {timeStr}
      </div>
      <p className='mt-3 text-xs text-neutral-500'>* 네이버 시계와 동일한 KST 기반 실시간 표시</p>
    </div>
  );
}

// 간단 타이머 카드 (설정 버튼 + 시작/일시정지/리셋)
function TimerCard() {
  const [seconds, setSeconds] = useState(0); // 설정된 전체 초
  const [remaining, setRemaining] = useState(0); // 남은 초
  const [running, setRunning] = useState(false);
  const [flash, setFlash] = useState(false);
  const beepRef = useRef<HTMLAudioElement>(null);

  // 카운트다운
  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        if (next <= 0) {
          // 종료 처리
          setRunning(false);
          setFlash(true);
          setTimeout(() => {
            if (beepRef.current) {
              try {
                beepRef.current.currentTime = 0;
              } catch {}
              beepRef.current.play().catch(() => {});
            }
            if ('Notification' in window) {
              if (Notification.permission === 'granted') {
                new Notification('타이머 완료', { body: '설정한 시간이 완료되었습니다.' });
              }
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

  // 남은 시간 포맷
  const mmss = useMemo(() => {
    const m = Math.floor(remaining / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(remaining % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  }, [remaining]);

  // 권한 요청 (최초 1회 정도 호출될 수 있게 버튼에서 트리거)
  function ensureNotifyPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }

  // 프리셋 설정
  function setPreset(min: number) {
    const total = Math.max(0, Math.round(min * 60));
    setSeconds(total);
    setRemaining(total);
    setRunning(false);
    ensureNotifyPermission();
  }

  // 사용자 지정 (분:초 또는 분)
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
    if (remaining <= 0 && seconds > 0) {
      // 완료 상태에서 다시 시작하면 처음부터
      setRemaining(seconds);
    }
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setRemaining(seconds);
  }

  return (
    <div className='rounded-xl border bg-white/70 p-6 shadow-sm backdrop-blur dark:bg-neutral-900/70'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h3 className='shrink-0 whitespace-nowrap text-lg font-semibold'>타이머</h3>
        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={() => setPreset(45)}
            className='rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800'
          >
            컴활 1급 (45분)
          </button>
          <button
            type='button'
            onClick={() => setPreset(40)}
            className='rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800'
          >
            컴활 2급 (40분)
          </button>
          <button
            type='button'
            onClick={() => setPreset(30)}
            className='rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800'
          >
            워드 (30분)
          </button>
          <button
            type='button'
            onClick={setCustom}
            className='rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800'
          >
            사용자 지정
          </button>
        </div>
      </div>

      <div className='mt-6 text-center'>
        <div className='whitespace-nowrap text-6xl font-bold tabular-nums leading-none'>{mmss}</div>
        <p className='mt-2 text-xs text-neutral-500'>
          현재 설정: {Math.floor(seconds / 60)}분 {seconds % 60}초
        </p>

        <div className='mt-6 flex items-center justify-center gap-3'>
          <button
            type='button'
            onClick={toggle}
            className='rounded-md border px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800'
            disabled={seconds === 0}
          >
            {running ? '일시정지' : remaining === 0 ? '다시 시작' : '시작'}
          </button>
          <button
            type='button'
            onClick={reset}
            className='rounded-md border px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800'
            disabled={seconds === 0}
          >
            리셋
          </button>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <>
      <HeroSection />

      <TimeTools />

      {/* <SupportBand /> */}
      {/* <Footer /> */}
    </>
  );
}
