export function FeedbackBar() {
  return (
    <section className='mx-auto mt-6 w-full max-w-4xl rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur dark:bg-neutral-900/70'>
      <h3 className='mb-3 text-base font-semibold'>피드백 요청 관리</h3>
      <div className='mb-4 rounded-md border bg-neutral-50 px-3 py-2 text-sm dark:bg-neutral-800'>
        <p>
          <span className='font-medium'>김재서</span> (2025.09.15): 시계 창을 내리면 시간이 멈추는
          오류 발생 → <span className='font-semibold text-green-600'>해결 완료</span>
        </p>
      </div>
    </section>
  );
}
