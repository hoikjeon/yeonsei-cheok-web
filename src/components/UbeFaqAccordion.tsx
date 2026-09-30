'use client';

import { useId, useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface UbeFaqAccordionProps {
  items: FaqItem[];
}

// 답변은 접혀 있어도 항상 HTML에 렌더링합니다.
// 자바스크립트를 실행하지 않는 검색·AI 크롤러도 모든 답변을 읽을 수 있어야 합니다.
const UbeFaqAccordion = ({ items }: UbeFaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-question-${index}`;
        const panelId = `${baseId}-answer-${index}`;

        return (
          <div
            key={item.question}
            className={`overflow-hidden border-b border-slate-200 transition-colors ${
              isOpen ? 'bg-slate-50' : 'bg-white'
            }`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="grid w-full grid-cols-[36px_minmax(0,1fr)_24px] items-center gap-3 px-1 py-5 text-left sm:grid-cols-[46px_minmax(0,1fr)_28px] sm:gap-4 sm:py-6 md:grid-cols-[64px_minmax(0,1fr)_32px] md:py-7"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="font-montserrat text-lg font-bold text-primary sm:text-xl md:text-2xl">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 break-keep text-[1rem] font-bold leading-[1.55] text-ink sm:text-lg sm:leading-relaxed md:text-xl">
                  {item.question}
                </span>
                <span className="text-center font-montserrat text-2xl font-medium text-ink" aria-hidden>
                  {isOpen ? '-' : '+'}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="break-keep pb-6 pl-[39px] pr-1 text-body text-ink-sub sm:pb-7 sm:pl-[51px] sm:text-base sm:leading-relaxed md:pl-[69px] md:pr-10 md:text-[17px]">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UbeFaqAccordion;
