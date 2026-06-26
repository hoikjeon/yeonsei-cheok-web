-- 메인 공지사항 / 휴진일 정보바 설정 테이블
-- Supabase SQL Editor에서 이 파일만 실행하면 기존 팝업/예약 데이터는 건드리지 않습니다.

CREATE TABLE IF NOT EXISTS public.home_notice_settings (
  id text PRIMARY KEY DEFAULT 'main',
  is_active boolean NOT NULL DEFAULT true,
  notices jsonb NOT NULL DEFAULT '[]'::jsonb,
  closed_month text NOT NULL DEFAULT '',
  closed_message text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT home_notice_settings_singleton CHECK (id = 'main')
);

ALTER TABLE public.home_notice_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read home notice settings" ON public.home_notice_settings;
DROP POLICY IF EXISTS "Allow service manage home notice settings" ON public.home_notice_settings;

CREATE POLICY "Allow public read home notice settings"
  ON public.home_notice_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Allow service manage home notice settings"
  ON public.home_notice_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO public.home_notice_settings (
  id,
  is_active,
  notices,
  closed_month,
  closed_message
)
VALUES (
  'main',
  true,
  '[{"title":"[정상진료] 7.17(금) 제헌절 / 8.17(월) 대체공휴일","href":"/news/notice"}]'::jsonb,
  '2026년 06월',
  '휴진일이 없습니다.'
)
ON CONFLICT (id) DO NOTHING;
