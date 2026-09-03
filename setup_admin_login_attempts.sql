-- ============================================================================
-- 관리자 로그인 시도 기록 (무차별 대입 차단용)
-- Supabase SQL Editor에서 1회 실행하세요. 여러 번 실행해도 안전합니다.
--
-- 서버(service role)에서만 읽고 씁니다. anon/authenticated 에는 권한을 주지 않습니다.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_login_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip text NOT NULL,
  succeeded boolean NOT NULL DEFAULT false,
  attempted_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_login_attempts_ip_time_idx
  ON public.admin_login_attempts (ip, attempted_at DESC);

ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- 브라우저에서는 접근할 수 없어야 합니다.
REVOKE ALL ON TABLE public.admin_login_attempts FROM anon, authenticated;

DO $$
DECLARE
  policy_record record;
BEGIN
  FOR policy_record IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'admin_login_attempts'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_login_attempts', policy_record.policyname);
  END LOOP;
END $$;

-- 오래된 기록 정리용 함수 (선택). 30일 지난 기록을 지웁니다.
CREATE OR REPLACE FUNCTION public.purge_old_admin_login_attempts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  DELETE FROM public.admin_login_attempts
  WHERE attempted_at < now() - interval '30 days';
$$;

REVOKE ALL ON FUNCTION public.purge_old_admin_login_attempts() FROM PUBLIC, anon, authenticated;

-- 확인
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'admin_login_attempts';
