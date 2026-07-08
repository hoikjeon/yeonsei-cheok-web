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
              className="grid w-full grid-cols-[46px_minmax(0,1fr)_28px] items-center gap-4 px-1 py-6 text-left md:grid-cols-[64px_minmax(0,1fr)_32px] md:py-7"
              aria-expanded={isOpen}
            >
              <span className="font-montserrat text-xl font-black text-primary md:text-2xl">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 text-lg font-black leading-relaxed text-ink md:text-xl">
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
                  <div className="pb-7 pl-[51px] pr-1 text-base font-medium leading-relaxed text-ink-sub md:pl-[69px] md:pr-10 md:text-[17px]">
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
