-- ============================================================================
-- RLS 정리: 개인정보 테이블의 공개(anon) 조회·수정 권한 회수
-- Supabase SQL Editor에서 이 파일 전체를 1회 실행하세요. 여러 번 실행해도 안전합니다.
--
-- [배경]
-- setup_admin_tables.sql 이 만든 정책들이 USING (true) 로 열려 있어,
-- 브라우저에 노출되는 공개 anon 키만으로 예약·상담 신청자의 이름과 연락처를
-- 조회하고 수정할 수 있는 상태였습니다. popups 는 쓰기까지 열려 있었습니다.
--
-- [원칙]
--   · 관리자 화면은 service role(서버 전용 키)로만 읽고 씁니다. service role 은
--     RLS 를 우회하므로 아래에서 anon 권한을 모두 회수해도 정상 동작합니다.
--   · 브라우저(anon/로그인 회원)에는 꼭 필요한 최소 권한만 남깁니다.
--
--   테이블                  anon/authenticated 에게 허용
--   ----------------------  ------------------------------------------------
--   reservations            INSERT (온라인 예약 신청)
--   consultations           INSERT (푸터 빠른 상담 신청)
--   reviews                 없음  (목록·상세 모두 서버에서 service role 로 조회)
--   site_visits             없음  (서버 액션에서 service role 로 기록)
--   popups                  SELECT (메인 팝업 노출)
--   home_notice_settings    SELECT (메인 공지바·푸터 공지)
--   hospital_news           SELECT (병원소식 · 연세척TV · 트레이닝센터)
--
-- [주의] 이 SQL 을 적용하기 전에 아래 코드 변경이 먼저 배포되어야 합니다.
--   · 관리자 예약 목록      → listReservations() 서버 액션
--   · 관리자 팝업 관리      → listPopups() 서버 액션
--   · 관리자 공지바 설정    → getHomeNoticeSettings() 서버 액션
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 0) 대상 테이블의 기존 정책을 모두 삭제합니다.
--    (정책 이름이 환경마다 다를 수 있어 이름을 지정하지 않고 일괄 삭제합니다)
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  policy_record record;
BEGIN
  FOR policy_record IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'reservations',
        'consultations',
        'reviews',
        'site_visits',
        'popups',
        'home_notice_settings',
        'hospital_news'
      )
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      policy_record.policyname,
      policy_record.tablename
    );
  END LOOP;
END $$;


-- ----------------------------------------------------------------------------
-- 1) 예약 / 상담 : 신청(INSERT)만 허용, 조회·수정·삭제 전면 차단
-- ----------------------------------------------------------------------------
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.reservations FROM anon, authenticated;
REVOKE ALL ON TABLE public.consultations FROM anon, authenticated;

GRANT INSERT ON TABLE public.reservations TO anon, authenticated;
GRANT INSERT ON TABLE public.consultations TO anon, authenticated;

CREATE POLICY "Anyone can submit a reservation"
  ON public.reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can submit a consultation"
  ON public.consultations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);


-- ----------------------------------------------------------------------------
-- 2) 치료체험후기 / 방문통계 : 브라우저 접근 전면 차단
--    후기 목록·상세와 방문 기록은 모두 서버에서 service role 로 처리합니다.
-- ----------------------------------------------------------------------------
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.reviews FROM anon, authenticated;
REVOKE ALL ON TABLE public.site_visits FROM anon, authenticated;


-- ----------------------------------------------------------------------------
-- 3) 팝업 : 읽기만 공개, 쓰기는 관리자(service role) 전용
-- ----------------------------------------------------------------------------
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.popups FROM anon, authenticated;
GRANT SELECT ON TABLE public.popups TO anon, authenticated;

CREATE POLICY "Anyone can read popups"
  ON public.popups
  FOR SELECT
  TO anon, authenticated
  USING (true);


-- ----------------------------------------------------------------------------
-- 4) 메인 공지바 설정 : 읽기만 공개
--    기존 "Allow service manage home notice settings" 정책이 FOR ALL USING (true)
--    였기 때문에 anon 도 공지 문구를 바꿀 수 있었습니다.
-- ----------------------------------------------------------------------------
ALTER TABLE public.home_notice_settings ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.home_notice_settings FROM anon, authenticated;
GRANT SELECT ON TABLE public.home_notice_settings TO anon, authenticated;

CREATE POLICY "Anyone can read home notice settings"
  ON public.home_notice_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);


-- ----------------------------------------------------------------------------
-- 5) 병원소식 : 읽기만 공개 (연세척TV·트레이닝센터 섹션이 브라우저에서 조회)
-- ----------------------------------------------------------------------------
ALTER TABLE public.hospital_news ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.hospital_news FROM anon, authenticated;
GRANT SELECT ON TABLE public.hospital_news TO anon, authenticated;

CREATE POLICY "Anyone can read hospital news"
  ON public.hospital_news
  FOR SELECT
  TO anon, authenticated
  USING (true);


-- ----------------------------------------------------------------------------
-- 6) 적용 결과 확인
--    아래 SELECT 를 함께 실행해 정책이 의도대로 남았는지 확인하세요.
-- ----------------------------------------------------------------------------
SELECT
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'reservations', 'consultations', 'reviews', 'site_visits',
    'popups', 'home_notice_settings', 'hospital_news', 'consultation_posts'
  )
ORDER BY tablename, policyname;
