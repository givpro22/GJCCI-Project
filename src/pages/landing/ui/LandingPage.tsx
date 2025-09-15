import { FeedbackBar } from '@/widgets/FeedbackBar';
import { HeroSection } from '@/widgets/HeroSection';
import { TimeTools } from '@/widgets/time-tools/ui/TimeTools';

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <TimeTools />
      <FeedbackBar />

      {/* <SupportBand /> */}
      {/* <Footer /> */}
    </>
  );
}
