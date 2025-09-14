import { NaverLikeClock } from '@/entities/clock/ui/NaverLikeClock';
import { TimerCard } from '@/features/timer/ui/TimerCard';

export function TimeTools() {
  return (
    <section className='mx-auto w-full max-w-5xl px-4 py-10'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <NaverLikeClock />
        <TimerCard />
      </div>
    </section>
  );
}
