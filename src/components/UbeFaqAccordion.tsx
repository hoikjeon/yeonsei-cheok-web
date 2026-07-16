'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface FaqItem {
  question: string;
  answer: string;
}

interface UbeFaqAccordionProps {
  items: FaqItem[];
}

const UbeFaqAccordion = ({ items }: UbeFaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className={`overflow-hidden border-b border-slate-200 transition-colors ${
              isOpen ? 'bg-slate-50' : 'bg-white'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="grid w-full grid-cols-[36px_minmax(0,1fr)_24px] items-center gap-3 px-1 py-5 text-left sm:grid-cols-[46px_minmax(0,1fr)_28px] sm:gap-4 sm:py-6 md:grid-cols-[64px_minmax(0,1fr)_32px] md:py-7"
              aria-expanded={isOpen}
            >
              <span className="font-montserrat text-lg font-bold text-primary sm:text-xl md:text-2xl">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 break-keep text-[1rem] font-bold leading-[1.55] text-ink sm:text-lg sm:leading-relaxed md:text-xl">
                {item.question}
              </span>
              <span className="text-center font-montserrat text-2xl font-medium text-ink">
                {isOpen ? '-' : '+'}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="break-keep pb-6 pl-[39px] pr-1 text-body text-ink-sub sm:pb-7 sm:pl-[51px] sm:text-base sm:leading-relaxed md:pl-[69px] md:pr-10 md:text-[17px]">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default UbeFaqAccordion;
