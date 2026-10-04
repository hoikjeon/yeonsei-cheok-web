-- 회원 프로필의 공개 조회 차단. Supabase SQL Editor에서 전체를 실행합니다.
-- 범위: public.profiles의 조회 권한/정책만 변경합니다.
-- 비회원: 조회 차단 / 회원: 본인 프로필만 조회 / service_role: 기존 접근 유지.
-- 기존 데이터, 가입 트리거, 쓰기 정책과 다른 테이블은 변경하지 않습니다.
-- 운영 DB 적용 전 기존 profiles 정책 및 handle_new_user 정의를 확인하세요.

BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- RLS가 꺼진 환경에서 이를 켜면 기존 쓰기 동작까지 바뀔 수 있으므로,
-- 예상한 보안 설정과 다르면 변경 없이 중단합니다.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class
    WHERE oid = 'public.profiles'::regclass AND relrowsecurity
  ) THEN
    RAISE EXCEPTION 'profiles RLS is disabled; inspect existing policies before applying this change';
  END IF;
END $$;

REVOKE SELECT ON TABLE public.profiles FROM PUBLIC, anon;
GRANT SELECT ON TABLE public.profiles TO authenticated;

-- 기존 공개 SELECT/FOR ALL 정책은 OR로 결합됩니다. 제한적 정책을 추가해
-- 기존 허용 정책이 남아 있어도 타인 프로필을 조회할 수 없게 합니다.
-- 이후 anon에 SELECT 권한이 추가돼도 auth.uid()가 NULL이므로 차단됩니다.
DROP POLICY IF EXISTS "profiles_select_own_guard" ON public.profiles;
CREATE POLICY "profiles_select_own_guard"
  ON public.profiles AS RESTRICTIVE
  FOR SELECT TO anon, authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles AS PERMISSIVE
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

COMMIT;
