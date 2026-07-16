'use client';

import { Minus, Plus } from 'lucide-react';
import { useId, useState } from 'react';

const faqs = [
  {
    question: '손이 저리고 찌릿한데 단순 혈액순환 문제일까요?',
    answer:
      '손 저림은 혈액순환뿐 아니라 손목에서 정중신경이 눌리는 손목터널증후군이나 목에서 내려오는 신경 문제 등 여러 원인으로 생길 수 있습니다. 저린 손가락의 위치, 발생 시간, 악력 저하 여부를 함께 확인해야 합니다. 한쪽 팔다리가 갑자기 저리거나 힘이 빠지고 얼굴 처짐·말 어눌함이 동반되면 즉시 응급 진료를 받아야 하며, 물건을 자주 떨어뜨리거나 힘이 점점 약해지는 경우에도 빠른 진료가 필요합니다.',
  },
  {
    question: '발목을 삔 것과 골절은 어떻게 구분하나요?',
    answer:
      '통증이나 붓기만으로 염좌와 골절을 정확히 구분하기는 어렵습니다. 다친 직후와 진료 시 네 걸음 이상 체중을 싣고 걷기 어렵거나, 복사뼈와 발의 특정 뼈를 눌렀을 때 심한 압통이 있거나, 변형·심한 부종과 멍이 보이면 골절 가능성을 확인해야 합니다. 진찰 결과에 따라 X-ray 검사가 필요할 수 있으므로 억지로 걷지 말고 보호한 상태에서 진료받는 것이 좋습니다.',
  },
  {
    question: '족저근막염은 왜 아침 첫걸음이 가장 아픈가요?',
    answer:
      '자는 동안 발바닥의 족저근막이 짧아지고 긴장이 줄어든 상태에서 아침 첫걸음으로 갑자기 체중이 실리면 근막이 다시 늘어나며 통증이 두드러질 수 있습니다. 몇 걸음 뒤 통증이 줄기도 하지만 오래 서 있거나 많이 걸은 뒤 다시 심해질 수 있습니다. 종아리와 발바닥 스트레칭, 활동량과 신발 점검이 도움이 되며 통증이 지속되면 다른 원인이 없는지 확인이 필요합니다.',
  },
  {
    question: '아킬레스건이 아파도 계속 운동해도 되나요?',
    answer:
      '통증을 참고 달리기나 점프를 같은 강도로 계속하면 아킬레스건 손상이 악화될 수 있습니다. 통증을 유발하는 운동은 줄이거나 잠시 중단하고, 상태에 맞춰 종아리 근력과 유연성을 단계적으로 회복해야 합니다. 갑자기 뚝 하는 느낌이 들었거나 힘줄 부위가 꺼져 보이고 발끝으로 서거나 바닥을 밀기 어렵다면 파열 가능성이 있으므로 바로 진료받아야 합니다.',
  },
  {
    question: '손목·발목 보호대를 계속 착용해도 괜찮을까요?',
    answer:
      '보호대는 통증이 있거나 반복 동작을 할 때 관절을 중립 위치로 지지하는 데 일시적으로 도움이 될 수 있습니다. 다만 전문가 확인 없이 계속 고정하면 관절이 뻣뻣해지거나 근력이 약해지고, 너무 조이면 피부 자극이나 신경 압박이 생길 수 있습니다. 증상과 활동에 맞는 크기와 착용 시간을 정하고, 주기적으로 벗어 피부 상태와 저림·부종 여부를 확인하는 것이 좋습니다.',
  },
];

export default function WristAnkleFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const idBase = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${idBase}-question-${index}`;
        const panelId = `${idBase}-answer-${index}`;

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
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-50 text-primary transition-colors duration-300 group-hover:bg-primary-light"
                >
                  {isOpen ? (
                    <Minus size={21} strokeWidth={2.4} />
                  ) : (
                    <Plus size={21} strokeWidth={2.4} />
                  )}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                isOpen
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
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
