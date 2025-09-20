import { Button } from '@/shared/ui/shadcn/button';
import { FeedbackBar } from '@/widgets/FeedbackBar';
import { HeroSection } from '@/widgets/HeroSection';
import { TimeTools } from '@/widgets/time-tools/ui/TimeTools';

export function LandingPage() {
  const today = new Date().toLocaleDateString();

  return (
    <>
      <HeroSection />
      <div className='flex justify-center gap-4'>
        <Button size='lg' onClick={() => alert('개발중')}>
          {today} 시험 일정 확인
        </Button>
        <Button size='lg' onClick={() => alert('개발중')}>
          카메라 연결 확인
        </Button>
      </div>
      <TimeTools />
      <FeedbackBar />

      {/* <SupportBand /> */}
      {/* <Footer /> */}
    </>
  );
}
