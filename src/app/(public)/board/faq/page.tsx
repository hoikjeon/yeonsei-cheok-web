import type { Metadata } from 'next';
import FaqBoard from '@/components/FaqBoard';
import SubHero from '@/components/SubHero';
import { FAQ_ITEMS } from './data';

export const metadata: Metadata = {
  title: '자주하는 질문 | 연세척병원',
  description:
    '연세척병원의 예약, 진료, 검사, 입원, 편의시설, 서류발급 및 진료비 관련 자주하는 질문을 확인하세요.',
};

export default function FaqPage() {
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData).replace(/</g, '\\u003c'),
        }}
      />

      <SubHero
        title="자주하는 질문"
        subtitle={'병원 이용 전 궁금한 내용을 빠르게 확인해 보세요.\n자주 문의하시는 내용을 알기 쉽게 안내해 드립니다.'}
        path={[{ name: '커뮤니티' }, { name: '자주하는 질문' }]}
      />

      <section className="py-14 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
          <div className="mb-10 space-y-4 sm:mb-14 sm:space-y-5">
            <h2 className="break-keep text-h2 tracking-tight text-navy-900">
              궁금한 내용을
              <br />
              빠르게 찾아보세요.
            </h2>
            <p className="max-w-2xl break-keep text-[15px] font-medium leading-[1.8] text-ink-sub sm:text-[17px]">
              카테고리를 선택하거나 검색어를 입력하면 필요한 안내를 바로 확인할 수 있습니다.
            </p>
          </div>

          <FaqBoard />
        </div>
      </section>
    </main>
  );
}
