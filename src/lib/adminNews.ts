export const adminNewsTypes = ['notice', 'media', 'training', 'academic', 'youtube'] as const;

export type AdminNewsType = (typeof adminNewsTypes)[number];

export const adminNewsConfig: Record<
  AdminNewsType,
  {
    label: string;
    description: string;
    publicPath: string;
    titleLabel: string;
    contentLabel: string;
  }
> = {
  notice: {
    label: '공지사항',
    description: '병원 주요 안내와 휴진 소식을 등록합니다.',
    publicPath: '/news/notice',
    titleLabel: '공지 제목',
    contentLabel: '공지 내용',
  },
  media: {
    label: '방송·언론보도',
    description: '방송 출연과 언론 보도 자료를 등록합니다.',
    publicPath: '/news/media',
    titleLabel: '보도 제목',
    contentLabel: '보도 내용',
  },
  training: {
    label: '트레이닝센터',
    description: '국내외 의료진 교육과 트레이닝 활동을 등록합니다.',
    publicPath: '/news/training',
    titleLabel: '소식 제목',
    contentLabel: '활동 내용',
  },
  academic: {
    label: '학술소식',
    description: '논문·학회·연구 활동 소식을 등록합니다.',
    publicPath: '/news/academic',
    titleLabel: '소식 제목',
    contentLabel: '연구 내용',
  },
  youtube: {
    label: '연세척TV',
    description: '유튜브 영상과 의학 정보를 등록합니다.',
    publicPath: '/news/youtube',
    titleLabel: '영상 제목',
    contentLabel: '영상 요약 및 설명',
  },
};

export function isAdminNewsType(value: string): value is AdminNewsType {
  return adminNewsTypes.includes(value as AdminNewsType);
}
