import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** 예: '/news/youtube' */
  basePath: string;
  /** 페이지 이동 시 유지할 쿼리(검색어 등). 값이 비면 URL에서 생략됩니다. */
  query?: Record<string, string | undefined>;
  /** 한 번에 노출할 페이지 번호 개수. 모바일 가로폭을 넘지 않도록 기본 5개. */
  window?: number;
}

function buildHref(basePath: string, page: number, query: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

const arrowClass =
  'flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-primary';

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  query = {},
  window: windowSize = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // 페이지가 많아지면 번호가 모바일 화면을 넘치므로 현재 페이지 주변만 보여줍니다.
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const href = (page: number) => buildHref(basePath, page, query);

  return (
    <nav aria-label="페이지 이동" className="flex items-center justify-center gap-1 pt-8 sm:gap-2 sm:pt-10">
      <Link href={href(1)} aria-label="첫 페이지" className={arrowClass}>
        <ChevronsLeft size={18} />
      </Link>
      <Link href={href(Math.max(1, currentPage - 1))} aria-label="이전 페이지" className={arrowClass}>
        <ChevronLeft size={18} />
      </Link>

      {pageNumbers.map((num) => (
        <Link
          key={num}
          href={href(num)}
          aria-current={num === currentPage ? 'page' : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-[15px] font-bold transition-colors ${
            num === currentPage
              ? 'bg-navy-950 text-white'
              : 'text-ink-muted hover:bg-slate-50 hover:text-primary'
          }`}
        >
          {num}
        </Link>
      ))}

      <Link href={href(Math.min(totalPages, currentPage + 1))} aria-label="다음 페이지" className={arrowClass}>
        <ChevronRight size={18} />
      </Link>
      <Link href={href(totalPages)} aria-label="마지막 페이지" className={arrowClass}>
        <ChevronsRight size={18} />
      </Link>
    </nav>
  );
}
