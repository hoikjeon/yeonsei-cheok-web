-- 팝업 노출 자리(1~3) 지정 및 노출 기간 설정 컬럼 추가
-- Supabase SQL Editor에서 이 파일만 실행하면 기존 팝업 데이터는 건드리지 않습니다.
-- 여러 번 실행해도 안전합니다.

ALTER TABLE public.popups
  ADD COLUMN IF NOT EXISTS display_slot integer,
  ADD COLUMN IF NOT EXISTS starts_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS ends_at timestamp with time zone;

-- display_slot 은 1, 2, 3 또는 NULL(노출 안 함)만 허용
ALTER TABLE public.popups
  DROP CONSTRAINT IF EXISTS popups_display_slot_range;

ALTER TABLE public.popups
  ADD CONSTRAINT popups_display_slot_range
  CHECK (display_slot IS NULL OR display_slot BETWEEN 1 AND 3);

-- 같은 자리에 두 팝업이 지정되는 것을 방지 (NULL 은 중복 허용)
DROP INDEX IF EXISTS popups_display_slot_unique;

CREATE UNIQUE INDEX popups_display_slot_unique
  ON public.popups (display_slot)
  WHERE display_slot IS NOT NULL;
