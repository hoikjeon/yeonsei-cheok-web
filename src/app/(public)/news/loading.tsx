const skeletonCards = Array.from({ length: 6 });

export default function NewsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="병원소식을 불러오는 중"
      className="min-h-screen bg-slate-50"
    >
      <span className="sr-only" role="status">
        병원소식을 불러오는 중입니다.
      </span>

      <div
        aria-hidden="true"
        className="animate-pulse motion-reduce:animate-none"
      >
        <section className="px-3 pt-2 sm:px-8 sm:pt-3 lg:px-14 xl:px-20">
          <div className="flex min-h-[220px] items-center overflow-hidden rounded-[1.35rem] bg-[linear-gradient(100deg,#e8edf8_0%,#eef1f7_46%,#f7f0e3_100%)] shadow-[0_24px_60px_-40px_rgba(15,29,54,0.4)] ring-1 ring-navy-900/5 sm:min-h-[240px] sm:rounded-[2.25rem] md:min-h-[360px]">
            <div className="mx-auto w-full max-w-7xl space-y-5 px-5 py-9 sm:px-9 sm:py-12 md:px-12">
              <div className="h-4 w-32 rounded-full bg-slate-300/80 sm:w-40" />
              <div className="h-9 w-52 rounded-lg bg-slate-300/90 sm:h-12 sm:w-72 md:h-14" />
              <div className="space-y-2.5">
                <div className="h-4 w-full max-w-md rounded-full bg-slate-300/70" />
                <div className="h-4 w-2/3 max-w-xs rounded-full bg-slate-300/60" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto min-h-[720px] max-w-7xl border-x border-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-24">
            <div className="flex flex-col gap-4 border-b-2 border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="h-6 w-24 rounded-full bg-slate-200" />
              <div className="h-11 w-full rounded-lg bg-slate-100 sm:max-w-[340px]" />
            </div>

            <div className="grid grid-cols-1 gap-6 py-8 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 lg:py-10">
              {skeletonCards.map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white"
                >
                  <div className="aspect-[16/10] bg-slate-200" />
                  <div className="space-y-4 p-5 sm:p-6 md:p-8">
                    <div className="h-5 w-4/5 rounded-full bg-slate-200" />
                    <div className="h-5 w-3/5 rounded-full bg-slate-200/80" />
                    <div className="pt-4">
                      <div className="h-4 w-1/3 rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
