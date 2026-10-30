-- 메인 팝업 클릭 시 이동할 링크
-- Supabase SQL Editor에서 이 파일만 실행하면 됩니다. 기존 팝업 내용은 그대로 둡니다.
-- 사이트 안 주소(/health 등) 또는 http(s):// 로 시작하는 외부 주소. 비우면 클릭해도 이동하지 않습니다.

ALTER TABLE public.popups ADD COLUMN IF NOT EXISTS link_url text;
