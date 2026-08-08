'use client';

import { ChevronDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  type FaqCategory,
} from '@/app/(public)/board/faq/data';

const initialCategory = FAQ_CATEGORIES[0];
const initialOpenId =
  FAQ_ITEMS.find((item) => item.category === initialCategory)?.id ?? null;

export default function FaqBoard() {
  const [activeCategory, setActiveCategory] =
    useState<FaqCategory>(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<string | null>(initialOpenId);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLocaleLowerCase('ko-KR');

    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = item.category === activeCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        item.category,
        item.question,
        item.answer,
        ...(item.keywords ?? []),
      ]
        .join(' ')
        .toLocaleLowerCase('ko-KR');

      return searchableText.includes(normalizedQuery);
    });
  }, [activeCategory, searchTerm]);

  const selectCategory = (category: FaqCategory) => {
    const firstMatchingItem = FAQ_ITEMS.find(
      (item) => item.category === category,
    );

    setActiveCategory(category);
    setOpenId(firstMatchingItem?.id ?? null);
  };

  const changeSearchTerm = (value: string) => {
    setSearchTerm(value);
    setOpenId(null);
  };

  return (
    <div>
      <div className="pb-2">
        <div
          role="tablist"
          aria-label="자주하는 질문 카테고리"
          className="mx-auto grid w-full grid-cols-3 gap-1.5 rounded-2xl bg-[#eef2f9] p-1.5 sm:grid-cols-6 sm:gap-1 sm:rounded-full"
        >
          {FAQ_CATEGORIES.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectCategory(category)}
                className={`min-h-12 min-w-0 whitespace-nowrap rounded-xl px-1 text-[13px] font-bold leading-none transition sm:min-h-14 sm:rounded-full sm:px-2 sm:text-[14px] md:text-[15px] lg:px-4 lg:text-[17px] ${
                  isActive
                    ? 'bg-primary text-white shadow-[0_10px_24px_-14px_rgba(38,84,190,0.85)] ring-2 ring-primary/25'
                    : 'text-navy-900 hover:bg-white/75'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-5 border-b border-slate-300 pb-5 sm:mt-14 sm:flex-row sm:items-end sm:justify-between md:mt-16">
        <p className="text-[14px] font-bold text-ink-muted sm:text-[15px]">
          총 <strong className="text-[17px] text-navy-900">{filteredItems.length}</strong>개의 질문
        </p>

        <label className="group relative block w-full sm:max-w-[360px]">
          <span className="sr-only">자주하는 질문 검색</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => changeSearchTerm(event.target.value)}
            placeholder="검색어를 입력해주세요."
            className="w-full border-b-2 border-slate-300 bg-transparent py-3 pl-1 pr-12 text-[15px] font-medium text-ink outline-none transition placeholder:text-slate-400 focus:border-primary"
          />
          <Search
            aria-hidden="true"
            size={23}
            strokeWidth={2.3}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-navy-900 transition group-focus-within:text-primary"
          />
        </label>
      </div>

      {filteredItems.length > 0 ? (
        <div className="divide-y divide-slate-300">
          {filteredItems.map((item) => {
            const isOpen = item.id === openId;
            const answerId = `faq-answer-${item.id}`;
            const triggerId = `faq-trigger-${item.id}`;

            return (
              <article key={item.id}>
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-5 px-1 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:px-3 sm:py-8 lg:px-5"
                  >
                    <span className="break-keep text-[17px] font-bold leading-[1.6] tracking-[-0.02em] text-navy-900 transition-colors group-hover:text-primary sm:text-[20px] md:text-[22px]">
                      {item.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      size={25}
                      strokeWidth={2.1}
                      className={`shrink-0 text-ink transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </h3>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={`grid transition-[grid-template-rows,opacity,padding] duration-300 ease-out ${
                    isOpen
                      ? 'grid-rows-[1fr] pb-6 opacity-100 sm:pb-8'
                      : 'grid-rows-[0fr] pb-0 opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="rounded-2xl bg-slate-50 px-5 py-5 sm:rounded-[1.35rem] sm:px-8 sm:py-7 lg:px-10 lg:py-8">
                      <p className="break-keep text-[15px] font-medium leading-[1.85] text-ink sm:text-[17px] sm:leading-[1.9]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
          <Search size={36} strokeWidth={1.6} className="text-slate-300" />
          <p className="text-[17px] font-bold text-ink">검색 결과가 없습니다.</p>
          <p className="text-[14px] font-medium text-ink-muted">
            다른 검색어나 카테고리를 선택해 주세요.
          </p>
        </div>
      )}
    </div>
  );
}
