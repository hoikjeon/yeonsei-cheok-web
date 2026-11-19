'use client';

import { Minus, Plus } from 'lucide-react';
import { useId, useState } from 'react';

const faqs = [
  {
    question: '다른 병원에서 검사를 해봐도 이상이 없다는데, 왜 무릎 앞쪽이 계속 아픈가요?',
    answer: (
      <>
        <strong>슬개대퇴관절 부정정렬</strong>이 통증의 원인일 수 있습니다. 필요한 경우 관절경 검사로 슬개골의 움직임과 연골 표면을 함께 살펴볼 수 있습니다.
        특히 MRI에서 뚜렷하게 보이지 않는 미세한 연골 병변은 관절경으로 직접 관찰해 더 정확하게 확인할 수 있습니다.
      </>
    ),
  },
  {
    question: '무릎에서 소리가 나면 연골이 닳은 건가요?',
    answer:
      '그렇지는 않습니다. 통증 없는 소리는 정상적인 관절 움직임에서도 생길 수 있습니다. 소리와 함께 통증, 붓기, 잠김 또는 불안정감이 나타난다면 원인을 확인하는 진료가 필요합니다.',
  },
  {
    question: '무릎이 아프면 MRI를 꼭 찍어야 하나요?',
    answer:
      'MRI 촬영 여부는 증상과 진찰 결과에 따라 결정합니다. 무릎 관절 안팎의 연골·인대·힘줄 등을 자세히 살펴볼 때 MRI를 활용합니다. MRI에서 잘 보이지 않는 관절 내부의 미세한 연골 손상은 관절경 검사로 더 정확하게 확인할 수 있습니다.',
  },
  {
    question: '관절경 검사로 MRI보다 더 정확하게 진단할 수 있나요?',
    answer:
      '네. 연골 표면의 작은 손상처럼 MRI에서 뚜렷하게 보이지 않는 관절 내부 병변은 관절경으로 직접 살펴 더 정확하게 진단할 수 있습니다. 관절경 검사가 필요한지는 증상과 진찰, 영상 검사 결과를 종합해 판단합니다.',
  },
  {
    question: '퇴행성관절염은 치료할 수 있나요?',
    answer:
      '관절 연골은 한 번 손상되면 스스로 회복되기 어려워 과거에는 치료가 쉽지 않았습니다. 현재는 말기인 4기로 진행되기 전이라면 연골 손상 범위와 관절 상태에 따라 연골 재생술 등 새로운 치료 방법으로 손상된 연골 부위의 회복을 도울 수 있습니다. 치료 후 통증이 줄고 무릎 기능이 개선되는 등 좋은 결과가 보고되고 있습니다.',
  },
  {
    question: '반월상연골이 찢어지면 반드시 수술해야 하나요?',
    answer:
      '증상이 가벼우면 운동치료 등 비수술 치료가 가능합니다. 파열로 무릎이 걸려 움직이기 어렵거나 비수술 치료에도 증상이 계속되면 수술이 필요할 수 있습니다. 관절 표면의 연골도 손상된 경우에는 연골판 부분 절제술이나 봉합술에 연골 재생 치료를 병행해 무릎 기능 회복을 도울 수 있습니다.',
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
