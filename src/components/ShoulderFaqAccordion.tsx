'use client';

import { Minus, Plus } from 'lucide-react';
import { useId, useState } from 'react';

const faqs = [
  {
    question: '밤에 어깨 통증이 더 심해지는 이유는 무엇인가요?',
    answer:
      '회전근개 질환과 오십견 등 여러 어깨 질환에서 야간 통증이 나타날 수 있습니다. 통증이 있는 쪽으로 누울 때 압박이 커지거나 수면 자세로 관절 주변 조직이 자극될 수 있지만, 야간 통증만으로 질환을 구분할 수는 없습니다. 잠을 자주 깰 정도라면 진찰을 받아보는 것이 좋습니다.',
  },
  {
    question: 'MRI에서 회전근개가 찢어졌다면 꼭 수술해야 하나요?',
    answer:
      '그렇지 않습니다. 파열의 크기와 위치뿐 아니라 통증, 근력 저하, 다친 시점, 활동 수준, 비수술 치료 반응을 함께 살펴 결정합니다. 증상이 크지 않은 경우에는 약물·주사·운동치료 등을 먼저 고려할 수 있습니다.',
  },
  {
    question: '오십견은 시간이 지나면 저절로 좋아지나요?',
    answer:
      '많은 경우 시간이 지나며 호전되지만 회복에 수개월에서 수년이 걸릴 수 있고, 일부에서는 움직임 제한이 남을 수 있습니다. 통증을 조절하면서 관절 운동 범위를 회복하는 치료를 병행하면 일상 불편을 줄이는 데 도움이 됩니다.',
  },
  {
    question: '석회성건염의 석회는 반드시 제거해야 하나요?',
    answer:
      '항상 제거하는 것은 아닙니다. 휴식, 약물, 운동치료 등으로 좋아지는 경우가 많습니다. 통증이 지속되거나 기능 제한이 큰 경우에는 체외충격파, 초음파 유도 세척술 또는 관절내시경 치료를 환자 상태에 맞춰 검토할 수 있습니다.',
  },
  {
    question: '어깨 통증으로 바로 진료가 필요한 경우가 있나요?',
    answer:
      '외상 뒤 팔을 전혀 들 수 없거나 어깨 모양이 변한 경우, 심한 붓기·감각 저하·발열과 열감이 있는 경우에는 빠른 진료가 필요합니다. 가슴 통증이나 호흡 곤란, 턱이나 팔로 퍼지는 통증이 함께 있으면 응급 평가를 받아야 합니다.',
  },
];

export default function ShoulderFaqAccordion() {
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
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-50 text-primary transition-colors duration-300 group-hover:bg-primary-light"
                >
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
