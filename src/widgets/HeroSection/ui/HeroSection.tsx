export function HeroSection() {
  return (
    <section className='py-10 text-center'>
      <>
        <img src='./og-image.png' alt='광주상공회의소 타이머' className='h-18 mx-auto mb-4' />
        <h1 className='text-primary text-3xl font-extrabold tracking-tight'>
          광주상공회의소 부감독 맞춤 시간 도구
        </h1>
        <div className='mt-5 flex flex-col items-center gap-2'>
          <a
            href='https://gjcci-next-4km4v2xhz-youngseos-projects-83ff578b.vercel.app/'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-primary focus-visible:ring-primary/40 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
            aria-label='최신 업데이트 버전 링크 새 탭에서 열기 (2025.02.03 기준)'
          >
            최신 버전 바로가기
            <span className='text-white/80' aria-hidden='true'>
              ↗
            </span>
          </a>
          <p className='text-xs text-neutral-500 dark:text-neutral-400'>
            2025.02.03 기준 · 클릭하면 새 탭에서 열려요
          </p>
        </div>
        <p className='mt-4 text-base text-neutral-600 dark:text-neutral-300'>
          시험 시간 진행에 따라 화면이 번쩍이는 알림을 제공합니다: 절반 남았을 때{' '}
          <span className='font-semibold text-blue-500'>파란색</span>, 1분 30초 남았을 때{' '}
          <span className='font-semibold text-green-500'>초록색</span>, 시간이 끝났을 때{' '}
          <span className='font-semibold text-red-500'>빨간색</span>으로 표시됩니다.
        </p>
      </>
    </section>
  );
}
