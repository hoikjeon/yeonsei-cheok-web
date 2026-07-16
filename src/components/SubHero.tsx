import Link from 'next/link';
import { Home, ChevronDown } from 'lucide-react';

interface SubHeroProps {
  title: string;
  subtitle: string;
  path: { name: string; href?: string }[];
  /** 유지: 하위 페이지 호환용 (라이트 히어로에서는 배경 이미지를 사용하지 않습니다) */
  bgImage?: string;
}

const SubHero = ({ title, subtitle, path }: SubHeroProps) => {
  return (
    <section className="px-3 pt-2 sm:px-8 sm:pt-3 lg:px-14 xl:px-20">
      <div className="relative isolate flex min-h-[220px] items-center overflow-hidden rounded-[1.35rem] bg-[linear-gradient(100deg,#e8edf8_0%,#eef1f7_46%,#f7f0e3_100%)] shadow-[0_24px_60px_-40px_rgba(15,29,54,0.4)] ring-1 ring-navy-900/5 sm:min-h-[240px] sm:rounded-[2.25rem] md:min-h-[360px]">
        {/* 우측 따뜻한 글로우 + 동심원 데코 */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* 동심원 아크 */}
          <div className="absolute right-[-28%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-60 bg-[repeating-radial-gradient(circle,transparent_0,transparent_34px,rgba(226,168,88,0.16)_35px,transparent_37px)] sm:right-[4%] sm:h-[760px] sm:w-[760px] sm:opacity-70 sm:bg-[repeating-radial-gradient(circle,transparent_0,transparent_46px,rgba(226,168,88,0.16)_47px,transparent_49px)]" />
          {/* 따뜻한 포컬 글로우 */}
          <div className="absolute right-[-12%] top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,205,128,0.42)_0%,rgba(255,224,173,0.18)_34%,transparent_66%)] blur-[4px] sm:right-[8%] sm:h-[540px] sm:w-[540px] sm:bg-[radial-gradient(circle,rgba(255,205,128,0.5)_0%,rgba(255,224,173,0.22)_34%,transparent_66%)]" />
          {/* 좌측 텍스트 영역 정돈용 페이드 */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#e9edf8_16%,rgba(233,237,248,0.35)_52%,transparent_80%)]" />
        </div>

        {/* 콘텐츠 */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-5 py-9 sm:px-9 sm:py-12 md:px-12">
          <div className="fade-up max-w-2xl space-y-3 sm:space-y-4 md:space-y-5">
            <nav className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] font-semibold text-slate-500 sm:gap-x-2 sm:text-[13px] md:text-sm">
              <Link
                href="/"
                aria-label="홈으로"
                className="flex items-center transition-colors hover:text-primary"
              >
                <Home size={16} strokeWidth={2.2} className="text-amber-500" />
              </Link>
              {path.map((p, i) => (
                <span key={i} className="flex items-center gap-x-2">
                  <span className="text-[8px] text-slate-300">●</span>
                  {p.href ? (
                    <Link
                      href={p.href}
                      className="flex items-center gap-0.5 transition-colors hover:text-primary"
                    >
                      {p.name}
                      <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-0.5 text-slate-600">
                      {p.name}
                      <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
                    </span>
                  )}
                </span>
              ))}
            </nav>

            <div className="space-y-3">
              <h1 className="break-keep text-display tracking-tight text-navy-900">
                {title}
              </h1>
              <p className="max-w-xl whitespace-pre-line break-keep text-body-lg leading-[1.65] text-slate-600">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubHero;
