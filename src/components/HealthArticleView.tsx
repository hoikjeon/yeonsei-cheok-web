import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, ChevronDown, ChevronRight, Home } from 'lucide-react';
import {
  HEALTH_CATEGORIES,
  HEALTH_DISCLAIMER,
  HEALTH_HOSPITAL_AUTHOR,
  type HealthArticle,
  type HealthImage,
  type HealthSection,
  formatHealthDate,
  getHealthReviewer,
  healthArticlePath,
} from '@/lib/healthArticles';

// 건강정보 글 화면입니다. 공개 페이지(/health/[slug])와 관리자 미리보기가 같이 씁니다.
// PC: 왼쪽 목차 · 가운데 본문 · 오른쪽 다른 글 / 모바일: 한 줄로 쌓습니다.

export type HealthArticleCard = Pick<HealthArticle, 'slug' | 'title' | 'thumbnail' | 'thumbnailPosition'>;

function ArticleImage({ image, priority = false }: { image: HealthImage; priority?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-slate-100">
      <div className="relative aspect-[16/9]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 720px"
          className="object-cover"
          style={{ objectPosition: image.position ?? 'center' }}
        />
      </div>
    </figure>
  );
}

function ArticleSection({ section }: { section: HealthSection }) {
  const { table } = section;
  return (
    <section id={section.id} className="scroll-mt-28 space-y-5">
      <h2 className="break-keep text-h3 tracking-tight text-ink">{section.heading}</h2>
      {section.lead ? <p className="break-keep text-base font-bold leading-[1.8] text-navy-900 md:text-lg">{section.lead}</p> : null}
      {section.paragraphs?.map((paragraph, index) => (
        <p key={index} className="break-keep text-base font-medium leading-[1.85] text-ink-sub md:text-[17px]">
          {paragraph}
        </p>
      ))}
      {section.bullets?.length ? (
        <ul className="space-y-3 rounded-2xl bg-slate-50 p-5 md:p-7">
          {section.bullets.map((bullet, index) => (
            <li key={index} className="flex gap-3 break-keep text-[15px] font-medium leading-relaxed text-ink-sub md:text-base">
              <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
      {table ? (
        <>
          {/* 모바일: 표를 가로로 밀지 않아도 모든 칸이 보이도록 행마다 카드로 풉니다. */}
          <div className="space-y-3 sm:hidden">
            <p className="text-[13px] font-bold text-ink-sub">{table.caption}</p>
            {table.rows.map((row, rowIndex) => (
              <dl key={rowIndex} className="rounded-2xl border border-slate-200 p-4">
                <dt className="mb-2 break-keep text-[15px] font-bold text-ink">{row[0]}</dt>
                {row.slice(1).map((cell, index) => (
                  <dd key={index} className="flex gap-3 break-keep py-1 text-[14px] font-medium leading-relaxed text-ink-sub">
                    <span className="w-24 shrink-0 font-bold text-navy-900">{table.columns[index + 1]}</span>
                    <span>{cell}</span>
                  </dd>
                ))}
              </dl>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 sm:block">
            <table className="w-full min-w-[560px] border-collapse text-left text-[14px] md:text-[15px]">
              <caption className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-[13px] font-bold text-ink-sub">{table.caption}</caption>
              <thead>
                <tr className="bg-navy-900 text-white">
                  {table.columns.map((column, index) => (
                    <th key={index} scope="col" className="px-4 py-3 font-bold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-slate-100 align-top">
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <th key={index} scope="row" className="break-keep bg-slate-50/70 px-4 py-3 font-bold text-ink">
                          {cell}
                        </th>
                      ) : (
                        <td key={index} className="break-keep px-4 py-3 font-medium leading-relaxed text-ink-sub">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
      {section.image ? <ArticleImage image={section.image} /> : null}
    </section>
  );
}

function TableOfContents({ items }: { items: Array<{ id: string; heading: string; sub?: boolean }> }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={`${index}-${item.id}`} className={item.sub ? 'pl-4' : ''}>
          <a
            href={`#${item.id}`}
            className={`block break-keep leading-snug transition-colors hover:text-primary ${item.sub ? 'text-[13px] text-slate-500' : 'text-[14px] font-medium text-ink-sub'}`}
          >
            {item.heading}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function HealthArticleView({
  article,
  relatedArticles,
  moreArticles = [],
}: {
  article: HealthArticle;
  relatedArticles: Array<Pick<HealthArticle, 'slug' | 'title'>>;
  /** 오른쪽 "다른 건강정보" 칸에 보일 글 */
  moreArticles?: HealthArticleCard[];
}) {
  const reviewer = getHealthReviewer(article);
  const category = HEALTH_CATEGORIES[article.category];
  const tags = [...new Set([category.name, ...article.keywords.slice(0, 2)])];
  const tocItems = [
    ...article.sections.map((section) => ({ id: section.id, heading: section.heading })),
    ...(article.warningSigns.length ? [{ id: 'warning-signs', heading: '이럴 때는 바로 진료를 받으세요' }] : []),
    ...(article.faq.length
      ? [{ id: 'faq', heading: '자주 묻는 질문' }, ...article.faq.map((item, index) => ({ id: `faq-${index + 1}`, heading: item.question, sub: true }))]
      : []),
  ];

  return (
    <article className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-12">
        <nav aria-label="현재 위치" className="mb-8 flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-slate-500 sm:text-[13px] lg:mb-12">
          <Link href="/" aria-label="홈으로" className="transition-colors hover:text-primary">
            <Home size={15} strokeWidth={2.2} className="text-amber-500" />
          </Link>
          <ChevronRight size={14} aria-hidden className="text-slate-400" />
          <Link href="/health" className="transition-colors hover:text-primary">
            척추·관절 건강정보
          </Link>
          <ChevronRight size={14} aria-hidden className="text-slate-400" />
          <span className="text-slate-600">{category.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[200px_minmax(0,1fr)_240px] xl:grid-cols-[220px_minmax(0,720px)_260px] xl:justify-between">
          {/* 왼쪽 목차 */}
          <aside className="hidden lg:block">
            <nav aria-labelledby="toc-heading" className="sticky top-28">
              <h2 id="toc-heading" className="mb-5 text-[17px] font-bold text-ink">
                목차
              </h2>
              <TableOfContents items={tocItems} />
            </nav>
          </aside>

          {/* 본문 */}
          <div className="min-w-0 space-y-12 md:space-y-16">
            <header className="space-y-6">
              <ul className="flex flex-wrap gap-2" aria-label="분류">
                {tags.map((tag) => (
                  <li key={tag} className="rounded-md bg-slate-100 px-3 py-1.5 text-[13px] font-semibold text-slate-600">
                    {tag}
                  </li>
                ))}
              </ul>
              <h1 className="break-keep text-h2 tracking-tight text-navy-900">{article.title}</h1>
              <p className="break-keep text-base font-medium leading-[1.75] text-slate-500 md:text-lg">{article.description}</p>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-8">
                <Image
                  src={reviewer?.image ?? HEALTH_HOSPITAL_AUTHOR.image}
                  alt=""
                  width={48}
                  height={48}
                  className={`h-12 w-12 shrink-0 rounded-full ring-1 ring-slate-200 ${reviewer ? 'object-cover object-top' : 'bg-white object-contain p-1.5'}`}
                />
                <div className="min-w-0">
                  <p className="break-keep text-[15px] font-bold text-ink">
                    {reviewer ? `${reviewer.name} ${reviewer.jobTitle}` : HEALTH_HOSPITAL_AUTHOR.name}
                    {reviewer ? <span className="ml-1.5 text-[13px] font-semibold text-slate-500">{reviewer.specialty} 검토</span> : null}
                  </p>
                  <p className="text-[13px] font-medium text-slate-500">
                    <time dateTime={article.publishedAt}>{formatHealthDate(article.publishedAt)}</time>
                    {reviewer ? (
                      <>
                        {' · '}
                        <time dateTime={article.reviewedAt}>최종 검토 {formatHealthDate(article.reviewedAt)}</time>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
              {article.heroImage ? <ArticleImage image={article.heroImage} priority /> : null}
            </header>

            {/* 핵심 요약 */}
            <section aria-labelledby="summary-heading" className="rounded-2xl border-l-4 border-primary bg-primary/5 p-6 md:p-8">
              <h2 id="summary-heading" className="mb-3 text-[15px] font-bold text-primary">
                핵심 요약
              </h2>
              {article.summary.length === 1 ? (
                <p className="break-keep text-base font-semibold leading-[1.85] text-ink md:text-[17px]">{article.summary[0]}</p>
              ) : (
                <ul className="space-y-3">
                  {article.summary.map((line, index) => (
                    <li key={index} className="flex gap-3 break-keep text-base font-semibold leading-[1.8] text-ink md:text-[17px]">
                      <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* 모바일 목차 */}
            <details className="group rounded-2xl border border-slate-200 p-5 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-bold text-ink">
                목차
                <ChevronDown size={18} aria-hidden className="text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4">
                <TableOfContents items={tocItems} />
              </div>
            </details>

            {article.sections.map((section, index) => (
              <ArticleSection key={`${index}-${section.id}`} section={section} />
            ))}

            {/* 진료가 필요한 신호 */}
            {article.warningSigns.length > 0 ? (
              <section id="warning-signs" className="scroll-mt-28 space-y-5 rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200/70 md:p-8">
                <h2 className="flex items-center gap-2 break-keep text-h4 text-ink">
                  <AlertTriangle size={22} strokeWidth={2.2} aria-hidden className="shrink-0 text-amber-600" />
                  이럴 때는 바로 진료를 받으세요
                </h2>
                <ul className="space-y-3">
                  {article.warningSigns.map((sign, index) => (
                    <li key={index} className="flex gap-3 break-keep text-[15px] font-semibold leading-relaxed text-ink md:text-base">
                      <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                      {sign}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* 자주 묻는 질문: 구조화 데이터와 같은 문구가 처음부터 화면에 보이도록 펼쳐 둡니다. */}
            {article.faq.length > 0 ? (
              <section id="faq" className="scroll-mt-28 space-y-6">
                <h2 className="break-keep text-h3 tracking-tight text-ink">자주 묻는 질문</h2>
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100">
                  {article.faq.map((item, index) => (
                    <div key={index} id={`faq-${index + 1}`} className="scroll-mt-28 space-y-3 p-6 md:p-7">
                      <h3 className="flex gap-3 break-keep text-base font-bold leading-relaxed text-ink md:text-[17px]">
                        <span aria-hidden className="font-montserrat text-primary">
                          Q
                        </span>
                        {item.question}
                      </h3>
                      <p className="flex gap-3 break-keep text-[15px] font-medium leading-[1.85] text-ink-sub md:text-base">
                        <span aria-hidden className="font-montserrat font-bold text-slate-400">
                          A
                        </span>
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* 검토 의료진 */}
            {reviewer ? (
              <section aria-labelledby="reviewer-heading" className="flex flex-col gap-5 rounded-2xl bg-slate-50 p-6 sm:flex-row sm:items-center md:p-8">
                <Image
                  src={reviewer.image}
                  alt={`${reviewer.name} ${reviewer.jobTitle} 프로필 사진`}
                  width={96}
                  height={96}
                  className="h-24 w-24 shrink-0 rounded-full object-cover object-top ring-4 ring-white"
                />
                <div className="space-y-2">
                  <h2 id="reviewer-heading" className="text-h4 text-ink">
                    {reviewer.name} {reviewer.jobTitle}
                    <span className="ml-2 text-[15px] font-semibold text-ink-sub">
                      {reviewer.specialty} · {reviewer.center}
                    </span>
                  </h2>
                  <ul className="space-y-1 text-[14px] font-medium text-ink-sub">
                    {reviewer.credentials.map((credential) => (
                      <li key={credential} className="break-keep">
                        {credential}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/doctors#${reviewer.id}`}
                    className="inline-flex items-center gap-1 pt-1 text-[14px] font-bold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                  >
                    의료진 소개 보기
                    <ArrowRight size={15} strokeWidth={2.4} aria-hidden />
                  </Link>
                </div>
              </section>
            ) : null}

            {/* 진료 안내 */}
            {article.relatedTreatments.length > 0 ? (
              <section aria-labelledby="treatments-heading" className="space-y-5">
                <h2 id="treatments-heading" className="break-keep text-h4 text-ink">
                  연세척병원 진료 안내
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {article.relatedTreatments.map((treatment) => (
                    <li key={treatment.path}>
                      <Link
                        href={treatment.path}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-5 py-4 text-[15px] font-bold text-ink transition-all hover:border-primary/30 hover:text-primary"
                      >
                        {treatment.name}
                        <ArrowRight size={17} strokeWidth={2.4} aria-hidden className="shrink-0 text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* 관련 글 */}
            {relatedArticles.length > 0 ? (
              <section aria-labelledby="related-heading" className="space-y-5">
                <h2 id="related-heading" className="break-keep text-h4 text-ink">
                  함께 읽으면 좋은 글
                </h2>
                <ul className="divide-y divide-slate-100 border-y border-slate-100">
                  {relatedArticles.map((related) => (
                    <li key={related.slug}>
                      <Link
                        href={healthArticlePath(related.slug)}
                        className="flex items-center justify-between gap-3 py-4 text-[15px] font-semibold text-ink-sub transition-colors hover:text-primary md:text-base"
                      >
                        <span className="break-keep">{related.title}</span>
                        <ChevronRight size={18} aria-hidden className="shrink-0 text-slate-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* 참고문헌 · 고지문 */}
            <footer className="space-y-5 border-t border-slate-100 pt-10">
              {article.references.length > 0 ? (
                <section aria-labelledby="references-heading" className="space-y-4">
                  <h2 id="references-heading" className="text-[15px] font-bold text-ink">
                    참고문헌
                  </h2>
                  <ol className="list-decimal space-y-2 pl-5 text-[13px] font-medium leading-relaxed text-ink-muted">
                    {article.references.map((reference, index) => (
                      <li key={index} className="break-words">
                        {reference.url ? (
                          <a href={reference.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
                            {reference.label}
                          </a>
                        ) : (
                          reference.label
                        )}
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}
              <p className="text-[13px] font-medium text-ink-muted">
                최초 게시 <time dateTime={article.publishedAt}>{formatHealthDate(article.publishedAt)}</time>
                {reviewer ? (
                  <>
                    {' · '}최종 검토 <time dateTime={article.reviewedAt}>{formatHealthDate(article.reviewedAt)}</time>
                  </>
                ) : null}
              </p>
              <p className="break-keep text-[13px] font-semibold italic leading-relaxed text-primary/80">{HEALTH_DISCLAIMER}</p>
            </footer>
          </div>

          {/* 오른쪽 다른 글 */}
          {moreArticles.length > 0 ? (
            <aside aria-labelledby="more-heading">
              <div className="lg:sticky lg:top-28">
                <h2 id="more-heading" className="mb-5 text-[17px] font-bold text-ink">
                  다른 건강정보
                </h2>
                <ul className="divide-y divide-slate-100 border-t border-slate-100">
                  {moreArticles.map((item) => (
                    <li key={item.slug}>
                      <Link href={healthArticlePath(item.slug)} className="group flex items-center gap-4 py-4">
                        <span className="line-clamp-3 min-w-0 flex-1 break-keep text-[14px] font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                          {item.title}
                        </span>
                        {item.thumbnail ? (
                          <span className="relative h-[72px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <Image
                              src={item.thumbnail}
                              alt=""
                              fill
                              sizes="96px"
                              className="object-cover"
                              style={{ objectPosition: item.thumbnailPosition ?? 'center' }}
                            />
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      {/* CTA */}
      <section className="border-y border-slate-100 bg-slate-50 px-5 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-4xl space-y-6 text-center md:space-y-8">
          <h2 className="break-keep text-h3 leading-tight text-ink">증상이 계속된다면 전문의와 상의하세요</h2>
          <p className="break-keep text-base leading-[1.75] text-ink-sub md:text-lg">
            진찰과 영상 검사로 원인을 확인한 뒤, 비수술 치료부터 단계적으로 치료 방향을 안내해 드립니다.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/reservation" className="w-full rounded-full bg-primary px-8 py-4 font-bold text-white shadow-blue-glow transition-all hover:bg-primary-dark sm:w-auto">
              진료 예약하기 →
            </Link>
            <Link href="/consultation" className="w-full rounded-full border border-slate-200 bg-white px-8 py-4 font-bold text-ink-sub transition-all hover:border-primary/30 sm:w-auto">
              온라인 상담
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
