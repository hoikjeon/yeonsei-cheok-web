'use client';

import Image from 'next/image';
import { useState } from 'react';

const regionTargets = [
  {
    id: 'cervical',
    label: '경추',
    point: { left: '50%', top: '27%' },
    button: { left: '68%', top: '27%' },
    line: { left: '50%', top: '27%', width: '18%' },
    title: '경추 적용대상',
    items: ['경추 척추관 협착증', '경추 디스크 탈출증', '경추 추간공 협착증'],
  },
  {
    id: 'thoracic',
    label: '흉추',
    point: { left: '50%', top: '46%' },
    button: { left: '29%', top: '46%' },
    line: { left: '29%', top: '46%', width: '21%' },
    title: '흉추 적용대상',
    items: ['흉추 척추관 협착증', '흉추 디스크 탈출증', '흉추 황색인대 골화증'],
  },
  {
    id: 'lumbar',
    label: '요추',
    point: { left: '50%', top: '65%' },
    button: { left: '29%', top: '65%' },
    line: { left: '29%', top: '65%', width: '21%' },
    title: '요추 적용대상',
    items: [
      '요추 척추관 협착증',
      '요추 디스크 탈출증',
      '요추 추간공 협착증',
      '요추 전방전위증',
      '요추 불안정증',
      '요추 수술 후 실패증후군',
    ],
  },
] as const;

const UbeIndicationMap = () => {
  const [activeId, setActiveId] = useState<(typeof regionTargets)[number]['id']>('lumbar');
  const activeTarget = regionTargets.find((target) => target.id === activeId) ?? regionTargets[2];

  return (
    <div className="relative mt-12 rounded-[28px] border border-slate-100 bg-white px-4 py-8 shadow-[0_24px_70px_rgba(15,29,54,0.07)] md:px-10 md:py-10">
      <div className="relative mx-auto aspect-[16/9] min-h-[430px] w-full max-w-6xl overflow-hidden md:min-h-0">
        <Image
          src="/generated/ube/ube-indication-spine-map.png"
          alt="경추, 흉추, 요추 적용 부위를 표시하기 위한 인체 척추 이미지"
          fill
          sizes="(min-width: 1024px) 1120px, 100vw"
          className="object-contain"
        />

        {regionTargets.map((target) => {
          const isActive = target.id === activeId;

          return (
            <div key={target.id}>
              <span
                aria-hidden
                className={`absolute z-10 border-t-2 border-dashed transition-colors duration-300 ${
                  isActive ? 'border-primary' : 'border-primary/45'
                }`}
                style={target.line}
              />

              <span
                aria-hidden
                className={`absolute z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-300 ${
                  isActive ? 'bg-primary/18' : 'bg-primary/10'
                }`}
                style={target.point}
              />
              <button
                type="button"
                aria-label={`${target.label} 적용대상 보기`}
                aria-pressed={isActive}
                onClick={() => setActiveId(target.id)}
                className={`absolute z-30 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-[0_12px_28px_rgba(38,84,190,0.24)] outline-none ring-8 transition duration-300 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:ring-primary/25 ${
                  isActive ? 'bg-primary ring-primary/20' : 'bg-primary/85 ring-primary/10'
                }`}
                style={target.point}
              />

              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveId(target.id)}
                className={`absolute z-30 flex -translate-y-1/2 items-center rounded-full px-6 py-3 text-base font-black shadow-[0_14px_34px_rgba(38,84,190,0.18)] outline-none transition duration-300 ease-out hover:-translate-y-[calc(50%+2px)] focus-visible:-translate-y-[calc(50%+2px)] focus-visible:ring-4 focus-visible:ring-primary/20 md:text-lg ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary ring-1 ring-primary/18 hover:bg-primary hover:text-white'
                }`}
                style={target.button}
              >
                {target.label}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-6 max-w-6xl rounded-2xl border border-primary/12 bg-[#F7FAFF] p-6 md:p-7">
        <div className="text-xl font-black text-primary">{activeTarget.title}</div>
        <div className="mt-4 flex flex-wrap gap-2 xl:flex-nowrap">
          {activeTarget.items.map((item) => (
            <span
              key={item}
              className="whitespace-nowrap rounded-full border border-primary/12 bg-white px-4 py-2 text-sm font-bold text-ink-sub"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UbeIndicationMap;
