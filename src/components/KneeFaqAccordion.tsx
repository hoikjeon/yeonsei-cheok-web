'use client';

import { Minus, Plus } from 'lucide-react';
import { useId, useState } from 'react';

const faqs = [
  {
    question: '무릎에서 소리가 나면 연골이 닳은 건가요?',
    answer:
      '그렇지는 않습니다. 통증 없는 소리는 정상적인 관절 움직임에서도 생길 수 있습니다. 소리와 함께 통증, 붓기, 잠김 또는 불안정감이 나타난다면 원인을 확인하는 진료가 필요합니다.',
  },
  {
    question: '무릎이 아프면 MRI를 꼭 찍어야 하나요?',
    answer:
      '항상 필요한 것은 아닙니다. 문진과 진찰, 필요 시 X-ray를 먼저 시행하며, 반월상연골·인대 손상이나 잠김·불안정성이 의심될 때 MRI를 고려합니다.',
  },
  {
    question: '퇴행성관절염은 완치될 수 있나요?',
    answer:
      '현재 치료는 통증을 줄이고 기능을 유지하며 진행 위험을 관리하는 데 목적이 있습니다. 운동·근력 강화·체중 관리와 약물 및 주사 치료 등을 환자 상태에 맞춰 단계적으로 검토합니다.',
  },
  {
    question: '반월상연골이 찢어지면 반드시 수술해야 하나요?',
    answer:
      '아닙니다. 증상이 심하지 않고 실제 잠김이나 지속적인 붓기가 없다면 운동치료 등 비수술 치료를 먼저 고려할 수 있습니다. 움직임을 막는 급성 파열이나 봉합 가능성이 있는 파열은 조기 수술 평가가 필요할 수 있습니다.',
  },
  {
    question: '관절내시경으로 관절염을 치료할 수 있나요?',
    answer:
      '관절염 자체를 씻어내거나 완치하는 치료는 아닙니다. 관절염과 함께 증상을 일으키는 반월상연골 파열이나 유리체 등 별도의 기계적 병변이 확인되고 비수술 치료에도 증상이 지속될 때 제한적으로 고려합니다.',
  },
];

export default function KneeFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-question-${index}`;
        const panelId = `${baseId}-answer-${index}`;

        return (
          <article key={faq.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex min-h-[76px] w-full items-center justify-between gap-4 py-5 text-left text-[1rem] font-bold leading-[1.55] tracking-tight text-ink transition hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary/15 sm:min-h-[92px] sm:gap-6 sm:px-2 sm:py-6 sm:text-[1.15rem] md:text-[1.3rem]"
              >
                <span className="min-w-0 break-words">{faq.question}</span>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-50 text-primary transition-colors duration-300 group-hover:bg-primary-light" aria-hidden>
                  {isOpen ? <Minus size={21} strokeWidth={2.4} /> : <Plus size={21} strokeWidth={2.4} />}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0">
                <p className="max-w-5xl pb-7 pr-2 text-body text-ink-sub sm:px-2 sm:pb-9 sm:text-[17px] sm:leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
