'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

type RegionTargetId = 'cervical' | 'thoracic' | 'lumbar';
type ConditionId =
  | 'cervical-stenosis'
  | 'cervical-disc'
  | 'cervical-foraminal-stenosis'
  | 'thoracic-stenosis'
  | 'thoracic-disc'
  | 'thoracic-olf'
  | 'lumbar-stenosis'
  | 'lumbar-disc'
  | 'lumbar-foraminal-stenosis'
  | 'lumbar-spondylolisthesis'
  | 'lumbar-instability'
  | 'lumbar-fbss';

interface RegionTarget {
  id: RegionTargetId;
  label: string;
  point: { left: string; top: string };
  button: { left: string; top: string };
  line: { left: string; top: string; width: string };
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  conditionIds: ConditionId[];
  symptoms: string[];
  checkpoints: string[];
}

interface ConditionDetail {
  id: ConditionId;
  regionId: RegionTargetId;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  symptoms: string[];
  checkpoints: string[];
}

interface ModalContent {
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  tags: string[];
  symptoms: string[];
  checkpoints: string[];
}

type ModalState =
  | { type: 'region'; id: RegionTargetId }
  | { type: 'condition'; id: ConditionId };

const conditions = {
  'cervical-stenosis': {
    id: 'cervical-stenosis',
    regionId: 'cervical',
    title: '경추 척추관 협착증',
    image: '/generated/ube/ube-condition-cervical-stenosis.png',
    imageAlt: '경추 척추관 협착증 의료 이미지',
    description:
      '경추 척추관 협착증은 목 부위의 신경 통로가 좁아져 척수나 신경근이 압박되는 질환입니다. 목 통증뿐 아니라 팔 저림, 손의 둔함, 보행 불편까지 이어질 수 있어 정밀한 영상 평가가 중요합니다.',
    symptoms: [
      '목과 어깨 통증이 반복되며 팔까지 저림이 이어지는 경우',
      '손끝 감각이 둔하거나 단추 채우기, 젓가락질이 불편한 경우',
      '심한 경우 보행이 불안정하거나 다리에 힘이 빠지는 경우',
    ],
    checkpoints: [
      'MRI에서 척수 압박 정도와 협착 범위를 확인',
      '팔 증상과 보행 이상 등 신경학적 변화를 함께 평가',
      '내시경 감압이 가능한 위치와 범위인지 전문의가 판단',
    ],
  },
  'cervical-disc': {
    id: 'cervical-disc',
    regionId: 'cervical',
    title: '경추 디스크 탈출증',
    image: '/generated/ube/ube-condition-cervical-disc.png',
    imageAlt: '경추 디스크 탈출증 의료 이미지',
    description:
      '경추 디스크 탈출증은 목뼈 사이의 디스크가 밀려나와 신경을 자극하거나 압박하는 상태입니다. 목에서 어깨, 팔, 손까지 내려가는 방사통이 대표적입니다.',
    symptoms: [
      '목을 뒤로 젖히거나 돌릴 때 팔 저림과 통증이 심해지는 경우',
      '어깨와 견갑골 주변 통증이 팔까지 이어지는 경우',
      '손의 힘이 약해지거나 감각 저하가 동반되는 경우',
    ],
    checkpoints: [
      '탈출된 디스크 위치와 신경 압박 방향을 확인',
      '통증 부위와 신경 분절이 일치하는지 평가',
      '보존적 치료 반응과 신경 손상 위험을 함께 고려',
    ],
  },
  'cervical-foraminal-stenosis': {
    id: 'cervical-foraminal-stenosis',
    regionId: 'cervical',
    title: '경추 추간공 협착증',
    image: '/generated/ube/ube-condition-cervical-foraminal-stenosis.png',
    imageAlt: '경추 추간공 협착증 의료 이미지',
    description:
      '경추 추간공 협착증은 목 신경이 빠져나가는 통로가 좁아져 특정 팔과 손으로 내려가는 신경 증상이 생기는 질환입니다. 한쪽 팔 저림이 뚜렷한 경우가 많습니다.',
    symptoms: [
      '한쪽 목, 어깨, 팔로 이어지는 날카로운 통증',
      '특정 손가락 부위의 저림이나 감각 저하',
      '팔을 들거나 목 자세에 따라 증상이 변하는 경우',
    ],
    checkpoints: [
      '추간공 협착 위치와 압박되는 신경근을 확인',
      '디스크, 골극, 관절 비후 중 주된 원인을 구분',
      '정밀 감압으로 신경 통로를 확보할 수 있는지 평가',
    ],
  },
  'thoracic-stenosis': {
    id: 'thoracic-stenosis',
    regionId: 'thoracic',
    title: '흉추 척추관 협착증',
    image: '/generated/ube/ube-condition-thoracic-stenosis.png',
    imageAlt: '흉추 척추관 협착증 의료 이미지',
    description:
      '흉추 척추관 협착증은 등 부위의 척수 통로가 좁아져 척수가 눌리는 질환입니다. 흉추는 척수가 직접 지나가는 부위라 증상 변화와 압박 정도를 세밀하게 봐야 합니다.',
    symptoms: [
      '등 중앙부 통증이나 몸통을 감싸는 듯한 저림',
      '다리 감각 이상, 힘 빠짐, 보행 불편감',
      '증상이 천천히 진행되며 균형감이 떨어지는 경우',
    ],
    checkpoints: [
      '척수 압박 정도와 병변 높이를 MRI로 확인',
      '하지 신경 증상과 보행 변화를 함께 평가',
      '흉추 구조 특성을 고려해 접근 난이도를 판단',
    ],
  },
  'thoracic-disc': {
    id: 'thoracic-disc',
    regionId: 'thoracic',
    title: '흉추 디스크 탈출증',
    image: '/generated/ube/ube-condition-thoracic-disc.png',
    imageAlt: '흉추 디스크 탈출증 의료 이미지',
    description:
      '흉추 디스크 탈출증은 등뼈 사이의 디스크가 돌출되어 척수나 신경을 압박하는 질환입니다. 흔하지는 않지만 병변 위치에 따라 통증과 신경 증상이 복합적으로 나타날 수 있습니다.',
    symptoms: [
      '등 통증이 가슴, 옆구리 방향으로 번지는 경우',
      '몸통을 감싸는 듯한 저림이나 화끈거림',
      '다리 저림, 힘 빠짐, 보행 장애가 동반되는 경우',
    ],
    checkpoints: [
      '디스크 돌출 방향과 척수 압박 여부를 확인',
      '통증 양상과 영상 소견이 일치하는지 평가',
      '주변 흉곽 구조를 고려해 치료 접근을 계획',
    ],
  },
  'thoracic-olf': {
    id: 'thoracic-olf',
    regionId: 'thoracic',
    title: '흉추 황색인대 골화증',
    image: '/generated/ube/ube-condition-thoracic-olf.png',
    imageAlt: '흉추 황색인대 골화증 의료 이미지',
    description:
      '흉추 황색인대 골화증은 척추 뒤쪽의 황색인대가 두꺼워지고 딱딱하게 변해 척수를 누르는 질환입니다. 진행성 신경 증상이 나타날 수 있어 정확한 판단이 필요합니다.',
    symptoms: [
      '등 통증과 함께 다리 감각 저하가 생기는 경우',
      '걸을 때 다리가 무겁고 중심 잡기가 어려운 경우',
      '증상이 점차 진행되거나 양쪽 다리에 나타나는 경우',
    ],
    checkpoints: [
      'CT와 MRI로 골화 범위와 척수 압박 정도를 확인',
      '신경학적 이상이 진행 중인지 면밀히 평가',
      '감압 범위와 주변 조직 손상 위험을 함께 검토',
    ],
  },
  'lumbar-stenosis': {
    id: 'lumbar-stenosis',
    regionId: 'lumbar',
    title: '요추 척추관 협착증',
    image: '/generated/ube/ube-condition-lumbar-stenosis.png',
    imageAlt: '요추 척추관 협착증 의료 이미지',
    description:
      '요추 척추관 협착증은 허리 신경이 지나가는 통로가 좁아져 엉덩이와 다리 통증, 저림, 보행 장애를 유발하는 질환입니다.',
    symptoms: [
      '오래 걸으면 다리가 저리고 쉬면 다시 좋아지는 경우',
      '허리보다 엉덩이, 종아리, 발 저림이 더 불편한 경우',
      '허리를 숙이면 편하고 뒤로 젖히면 증상이 심해지는 경우',
    ],
    checkpoints: [
      '협착 위치와 여러 마디 침범 여부를 확인',
      '보행 가능 거리와 일상생활 제한 정도를 평가',
      '감압이 필요한 부위와 불안정성 동반 여부를 판단',
    ],
  },
  'lumbar-disc': {
    id: 'lumbar-disc',
    regionId: 'lumbar',
    title: '요추 디스크 탈출증',
    image: '/generated/ube/ube-condition-lumbar-disc.png',
    imageAlt: '요추 디스크 탈출증 의료 이미지',
    description:
      '요추 디스크 탈출증은 허리 디스크가 돌출되어 신경을 누르는 질환입니다. 허리 통증과 함께 엉덩이, 다리, 발까지 이어지는 방사통이 생길 수 있습니다.',
    symptoms: [
      '허리에서 엉덩이, 다리로 뻗치는 통증',
      '기침이나 재채기, 앉은 자세에서 다리 통증이 심해지는 경우',
      '발목이나 발가락 힘이 약해지는 경우',
    ],
    checkpoints: [
      '탈출된 디스크 크기와 신경 압박 방향을 확인',
      '하지 직거상 검사와 영상 소견을 함께 평가',
      '마비나 배뇨 장애 같은 응급 신호가 있는지 확인',
    ],
  },
  'lumbar-foraminal-stenosis': {
    id: 'lumbar-foraminal-stenosis',
    regionId: 'lumbar',
    title: '요추 추간공 협착증',
    image: '/generated/ube/ube-condition-lumbar-foraminal-stenosis.png',
    imageAlt: '요추 추간공 협착증 의료 이미지',
    description:
      '요추 추간공 협착증은 허리 신경이 척추 밖으로 나가는 통로가 좁아진 상태입니다. 특정 다리 방향으로 통증과 저림이 뚜렷하게 내려갈 수 있습니다.',
    symptoms: [
      '한쪽 엉덩이와 다리 바깥쪽으로 저림이 이어지는 경우',
      '서 있거나 허리를 펴면 다리 통증이 심해지는 경우',
      '특정 신경 분절을 따라 감각 저하가 나타나는 경우',
    ],
    checkpoints: [
      '추간공 협착 위치와 압박 신경을 정확히 확인',
      '디스크 높이 감소, 골극, 관절 비후 원인을 구분',
      '충분한 신경 통로 확보가 가능한지 치료 범위를 판단',
    ],
  },
  'lumbar-spondylolisthesis': {
    id: 'lumbar-spondylolisthesis',
    regionId: 'lumbar',
    title: '요추 전방전위증',
    image: '/generated/ube/ube-condition-lumbar-spondylolisthesis.png',
    imageAlt: '요추 전방전위증 의료 이미지',
    description:
      '요추 전방전위증은 위쪽 척추뼈가 아래쪽 척추뼈보다 앞으로 밀려나면서 신경 통로가 좁아지는 질환입니다. 협착 증상과 허리 불안정감이 함께 나타날 수 있습니다.',
    symptoms: [
      '허리를 펴거나 오래 서 있을 때 허리와 다리 통증이 심한 경우',
      '엉덩이와 다리 저림으로 오래 걷기 어려운 경우',
      '허리가 흔들리는 듯한 불안정감이 느껴지는 경우',
    ],
    checkpoints: [
      '전위 정도와 동적 X-ray에서 움직임을 확인',
      '신경 압박 위치와 협착 범위를 함께 평가',
      '감압만으로 충분한지 안정화 치료가 필요한지 판단',
    ],
  },
  'lumbar-instability': {
    id: 'lumbar-instability',
    regionId: 'lumbar',
    title: '요추 불안정증',
    image: '/generated/ube/ube-condition-lumbar-instability.png',
    imageAlt: '요추 불안정증 의료 이미지',
    description:
      '요추 불안정증은 척추 마디가 과도하게 움직이며 주변 신경과 관절에 부담을 주는 상태입니다. 통증이 자세와 움직임에 따라 크게 달라지는 경우가 많습니다.',
    symptoms: [
      '앉았다 일어날 때 허리가 불안하고 통증이 심한 경우',
      '오래 서 있거나 허리를 젖힐 때 통증이 증가하는 경우',
      '협착이나 디스크 증상이 반복적으로 재발하는 경우',
    ],
    checkpoints: [
      '굽힘·폄 X-ray로 마디 움직임을 확인',
      '디스크와 후관절 퇴행 정도를 함께 평가',
      '내시경 치료 범위와 안정성 보존 가능성을 판단',
    ],
  },
  'lumbar-fbss': {
    id: 'lumbar-fbss',
    regionId: 'lumbar',
    title: '요추 수술 후 실패증후군',
    image: '/generated/ube/ube-condition-fbss.png',
    imageAlt: '요추 수술 후 실패증후군 의료 이미지',
    description:
      '요추 수술 후 실패증후군은 기존 수술 이후에도 통증이 남거나 다시 신경 압박 증상이 나타나는 상태를 말합니다. 재협착, 유착, 인접 분절 문제 등을 구분해야 합니다.',
    symptoms: [
      '수술 후에도 허리나 다리 통증이 계속되는 경우',
      '한동안 좋아졌다가 저림과 통증이 다시 심해지는 경우',
      '기존 수술 부위 주변 또는 인접 마디 증상이 의심되는 경우',
    ],
    checkpoints: [
      '기존 수술 부위와 현재 압박 원인을 구분',
      'MRI, CT로 유착, 재협착, 인접 분절 변화를 확인',
      '재수술 부담을 줄일 수 있는 최소침습 접근 가능성을 평가',
    ],
  },
} satisfies Record<ConditionId, ConditionDetail>;

const regionTargets = [
  {
    id: 'cervical',
    label: '경추',
    point: { left: '50%', top: '27%' },
    button: { left: '68%', top: '27%' },
    line: { left: '50%', top: '27%', width: '18%' },
    title: '경추 적용대상',
    image: '/generated/ube/ube-condition-cervical-summary.png',
    imageAlt: '경추 부위 신경 압박을 보여주는 의료 이미지',
    description:
      '경추 부위의 디스크 탈출이나 협착으로 목, 어깨, 팔까지 이어지는 신경 증상이 지속될 때 병변 위치와 신경 압박 정도를 정밀하게 확인합니다.',
    conditionIds: ['cervical-stenosis', 'cervical-disc', 'cervical-foraminal-stenosis'],
    symptoms: [
      '목과 어깨 통증이 반복되거나 팔까지 이어지는 경우',
      '손과 팔의 저림, 감각 저하, 힘 빠짐이 동반되는 경우',
      '약물·주사·물리치료 후에도 증상이 충분히 좋아지지 않는 경우',
    ],
    checkpoints: [
      'MRI·CT 검사에서 신경 압박 부위가 명확한지 확인',
      '증상 위치와 영상 소견이 서로 일치하는지 평가',
      '내시경 접근이 가능한 범위인지 전문의가 판단',
    ],
  },
  {
    id: 'thoracic',
    label: '흉추',
    point: { left: '50%', top: '46%' },
    button: { left: '29%', top: '46%' },
    line: { left: '29%', top: '46%', width: '21%' },
    title: '흉추 적용대상',
    image: '/generated/ube/ube-condition-thoracic-summary.png',
    imageAlt: '흉추 부위 신경 압박을 보여주는 의료 이미지',
    description:
      '흉추는 척수와 흉곽 구조가 가까운 부위이므로 등 통증이나 몸통을 감싸는 저림, 보행 이상이 있을 때 신경 압박 여부를 세밀하게 평가합니다.',
    conditionIds: ['thoracic-stenosis', 'thoracic-disc', 'thoracic-olf'],
    symptoms: [
      '등 중앙부 통증이나 옆구리, 가슴 쪽으로 감싸는 듯한 통증',
      '다리 감각 이상, 힘 빠짐, 보행 불편감이 동반되는 경우',
      '흉추 황색인대 골화증처럼 척수 압박 가능성이 있는 경우',
    ],
    checkpoints: [
      '척수 압박 정도와 병변 위치를 영상 검사로 확인',
      '증상 진행 속도와 신경학적 이상 여부를 함께 평가',
      '환자의 전신 상태와 병변 난이도에 맞춰 접근 방식을 결정',
    ],
  },
  {
    id: 'lumbar',
    label: '요추',
    point: { left: '50%', top: '65%' },
    button: { left: '29%', top: '65%' },
    line: { left: '29%', top: '65%', width: '21%' },
    title: '요추 적용대상',
    image: '/generated/ube/ube-condition-lumbar-summary.png',
    imageAlt: '요추 부위 신경 압박을 보여주는 의료 이미지',
    description:
      '요추 부위의 협착, 디스크 탈출, 추간공 협착 등으로 허리부터 엉덩이와 다리까지 통증과 저림이 이어질 때 정밀 감압 치료 가능성을 검토합니다.',
    conditionIds: [
      'lumbar-stenosis',
      'lumbar-disc',
      'lumbar-foraminal-stenosis',
      'lumbar-spondylolisthesis',
      'lumbar-instability',
      'lumbar-fbss',
    ],
    symptoms: [
      '허리, 엉덩이, 다리로 이어지는 통증과 저림이 지속되는 경우',
      '오래 걷기 어렵고 쉬면 나아지는 보행 장애가 있는 경우',
      '기존 수술 후에도 남은 통증이나 재협착이 의심되는 경우',
    ],
    checkpoints: [
      '보존적 치료에도 일상생활 불편이 지속되는지 확인',
      '영상 검사상 신경을 누르는 원인이 분명한지 평가',
      '불안정성 여부와 내시경 감압 범위를 함께 판단',
    ],
  },
] satisfies RegionTarget[];

const findTarget = (id: RegionTargetId) =>
  regionTargets.find((target) => target.id === id) ?? regionTargets[2];

const getModalContent = (modal: ModalState): ModalContent => {
  if (modal.type === 'condition') {
    const condition = conditions[modal.id];
    return {
      title: condition.title,
      image: condition.image,
      imageAlt: condition.imageAlt,
      description: condition.description,
      tags: [findTarget(condition.regionId).label, condition.title],
      symptoms: condition.symptoms,
      checkpoints: condition.checkpoints,
    };
  }

  const target = findTarget(modal.id);
  return {
    title: target.title,
    image: target.image,
    imageAlt: target.imageAlt,
    description: target.description,
    tags: target.conditionIds.map((id) => conditions[id].title),
    symptoms: target.symptoms,
    checkpoints: target.checkpoints,
  };
};

const DetailBlock = ({ number, title, items }: { number: number; title: string; items: string[] }) => (
  <section>
    <h4 className="flex items-center gap-3 text-[19px] font-bold tracking-tight text-ink">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[13px] font-bold text-white">
        {number}
      </span>
      {title}
    </h4>
    <ul className="mt-4 space-y-2 break-keep text-body text-ink-sub sm:text-[16px] md:text-[17px] md:leading-relaxed">
      {items.map((item) => (
        <li key={item}>· {item}</li>
      ))}
    </ul>
  </section>
);

const DetailModal = ({ content, onClose }: { content: ModalContent; onClose: () => void }) => (
  <div
    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/68 px-3 py-4 backdrop-blur-[2px] sm:px-4 sm:py-6"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }}
  >
    <article
      role="dialog"
      aria-modal="true"
      aria-labelledby="ube-indication-modal-title"
      className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[760px] flex-col overflow-hidden rounded-[1rem] bg-white shadow-[0_30px_100px_-40px_rgba(0,0,0,0.65)] sm:max-h-[82vh] sm:rounded-[1.15rem]"
    >
      <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 bg-navy-900 px-5 py-2 text-white sm:h-20 sm:px-7 sm:py-0">
        <h3 id="ube-indication-modal-title" className="break-keep text-[1.15rem] font-bold leading-tight tracking-tight sm:text-[1.45rem]">
          {content.title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="팝업 닫기"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-white/20 sm:h-11 sm:w-11"
        >
          <X size={32} strokeWidth={1.8} />
        </button>
      </header>

      <div className="overflow-y-auto px-5 py-6 sm:px-7 sm:py-8 md:px-10 md:py-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100 sm:aspect-[16/7] sm:rounded-sm">
          <Image
            src={content.image}
            alt={content.imageAlt}
            fill
            sizes="(min-width: 768px) 680px, calc(100vw - 56px)"
            className="object-cover"
          />
        </div>

        <p className="mt-6 break-keep text-[16px] font-semibold leading-[1.7] tracking-tight text-ink sm:mt-8 sm:text-[18px] sm:leading-relaxed md:text-[20px]">
          {content.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary/12 bg-[#F7FAFF] px-4 py-2 text-sm font-bold text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="my-6 h-px bg-slate-200 sm:my-8" />

        <div className="space-y-8 sm:space-y-10">
          <DetailBlock number={1} title="주요 증상" items={content.symptoms} />
          <DetailBlock number={2} title="진단 체크포인트" items={content.checkpoints} />
        </div>
      </div>
    </article>
  </div>
);

const UbeIndicationMap = () => {
  const [activeId, setActiveId] = useState<RegionTargetId>('lumbar');
  const [modal, setModal] = useState<ModalState | null>(null);
  const activeTarget = findTarget(activeId);
  const modalContent = modal ? getModalContent(modal) : null;

  const selectTarget = (id: RegionTargetId) => {
    setActiveId(id);
    setModal({ type: 'region', id });
  };

  const selectCondition = (id: ConditionId) => {
    setActiveId(conditions[id].regionId);
    setModal({ type: 'condition', id });
  };

  useEffect(() => {
    if (!modal) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModal(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modal]);

  return (
    <>
      <div className="relative mt-8 rounded-[1.25rem] border border-slate-100 bg-white px-4 py-5 shadow-[0_24px_70px_rgba(15,29,54,0.07)] sm:mt-12 sm:rounded-[28px] sm:py-8 md:px-10 md:py-10">
        <div className="grid gap-2.5 md:hidden">
          {regionTargets.map((target) => {
            const isActive = target.id === activeId;

            return (
              <button
                key={target.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectTarget(target.id)}
                className={`flex min-h-16 w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors focus:outline-none focus:ring-4 focus:ring-primary/15 ${
                  isActive
                    ? 'border-primary/25 bg-primary-light/65 text-primary'
                    : 'border-slate-200 bg-slate-50 text-ink'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      isActive ? 'bg-primary text-white' : 'bg-white text-primary ring-1 ring-primary/15'
                    }`}
                  >
                    {target.label.slice(0, 1)}
                  </span>
                  <span className="text-[1rem] font-bold">{target.title}</span>
                </span>
                <span className="shrink-0 text-[12px] font-bold text-ink-sub">
                  {target.conditionIds.length}개 질환
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mx-auto hidden aspect-[16/9] w-full max-w-6xl overflow-hidden md:block">
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
                  aria-label={`${target.label} 적용대상 자세히 보기`}
                  aria-pressed={isActive}
                  onClick={() => selectTarget(target.id)}
                  className={`absolute z-30 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-[0_12px_28px_rgba(38,84,190,0.24)] outline-none ring-8 transition duration-300 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:ring-primary/25 ${
                    isActive ? 'bg-primary ring-primary/20' : 'bg-primary/85 ring-primary/10'
                  }`}
                  style={target.point}
                />

                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectTarget(target.id)}
                  className={`absolute z-30 flex -translate-y-1/2 items-center rounded-full px-6 py-3 text-base font-bold shadow-[0_14px_34px_rgba(38,84,190,0.18)] outline-none transition duration-300 ease-out hover:-translate-y-[calc(50%+2px)] focus-visible:-translate-y-[calc(50%+2px)] focus-visible:ring-4 focus-visible:ring-primary/20 md:text-lg ${
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

        <div className="mx-auto mt-4 max-w-6xl rounded-xl border border-primary/12 bg-[#F7FAFF] p-4 sm:mt-6 sm:rounded-2xl sm:p-6 md:p-7">
          <div className="text-lg font-bold text-primary sm:text-xl">{activeTarget.title}</div>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            {activeTarget.conditionIds.map((conditionId) => {
              const condition = conditions[conditionId];

              return (
                <button
                  key={condition.id}
                  type="button"
                  onClick={() => selectCondition(condition.id)}
                  className="rounded-full border border-primary/12 bg-white px-3 py-2 text-[13px] font-bold leading-snug text-ink-sub transition hover:border-primary/35 hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/15 sm:whitespace-nowrap sm:px-4 sm:text-sm"
                >
                  {condition.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {modalContent ? <DetailModal content={modalContent} onClose={() => setModal(null)} /> : null}
    </>
  );
};

export default UbeIndicationMap;
