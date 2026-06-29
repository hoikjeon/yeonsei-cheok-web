-- 연세척병원 관리자 페이지 연동용 테이블 및 더미 데이터 (버전 2)

-- 1. 팝업 설정(popups) 테이블 기존 테이블 제거 및 재설계 (이미지 첨부 포함)
DROP TABLE IF EXISTS public.popups;

CREATE TABLE public.popups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,      -- 이미지 URL (Supabase Storage 경로 등)
  label text,          -- 예: Notice, Event 등 (우측 상단 뱃지용)
  is_active boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- (선택) RLS(상위 레벨 보안 정책) 허용 (모두 접근 가능) - 테스트용
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.popups FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.popups FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.popups FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.popups FOR DELETE USING (true);


-- 2. 테스트 팝업 슬라이드용 더미 데이터 삽입 (3개)
-- image_url은 기존에 있는 /ube_training.jpg 로 대체 테스트
INSERT INTO public.popups (title, content, image_url, label, is_active)
VALUES 
  ('메가병원 박준우 원장\nUBE 트레이닝 수료', '세계적으로 권위있는 척추내시경(UBE) 트레이닝 마스터 코스를 무사히 수료하셨습니다.', '/ube_training.jpg', 'Academic Excellence', true),
  ('연세척병원 야간진료\n목요일 연장 안내', '바쁜 직장인 분들을 위해 11월부터 매주 목요일 오후 8시 30분까지 도수치료 및 진료를 연장합니다.', '/ube_training.jpg', 'Notice', true),
  ('명절 연휴(설)\n정상진료 및 휴진안내', '2/9(금) 오전 진료, 2/10(토)~2/12(월) 휴진. 행복하고 넉넉한 명절 보내시길 바랍니다.', '/ube_training.jpg', 'Holiday', true);


-- 2. 온라인 상담(consultations) 및 예약(reservations) 테이블
CREATE TABLE IF NOT EXISTS public.consultations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  consultation_type text, -- 상담내용/통증 부위
  preferred_date date,    -- 상담 희망 날짜
  message text,
  marketing_agreed boolean DEFAULT false, -- 마케팅 수신 동의 여부
  is_checked boolean DEFAULT false, -- 확인 여부 추가
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.consultations
  ADD COLUMN IF NOT EXISTS consultation_type text,
  ADD COLUMN IF NOT EXISTS preferred_date date,
  ADD COLUMN IF NOT EXISTS marketing_agreed boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS public.reservations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text,           -- 초진/재진
  name text NOT NULL,      -- 이름
  phone text NOT NULL,     -- 연락처
  specialty text,         -- 진료과목
  doctor text,            -- 담당의
  reservation_date date,   -- 예약 희망일
  reservation_time text,   -- 예약 희망시간
  is_checked boolean DEFAULT false, -- 확인 여부 추가
  created_at timestamp with time zone DEFAULT now()
);

-- 권한 정책 (RLS)
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to consultations" ON public.consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read consultations" ON public.consultations FOR SELECT USING (true);
CREATE POLICY "Allow admin update consultations" ON public.consultations FOR UPDATE USING (true);

CREATE POLICY "Allow public insert to reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read reservations" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Allow admin update reservations" ON public.reservations FOR UPDATE USING (true);

-- (참고) 스토리지 버킷 만들기 안내 (직접 업로드할 경우 사용)
-- Supabase Dashboard -> Storage 메뉴에 가셔서 'popups' 라는 이름의 Public Bucket(버킷)을 만드시면 파일 업로드가 가능해집니다.

-- 3. 방문자 통계 추적 (Analytics) 테이블 추가
CREATE TABLE IF NOT EXISTS public.site_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at timestamp with time zone DEFAULT now(),
  visitor_id text, -- 브라우저별 고유 식별자 (동일 기기/브라우저 하루 1회 카운트 방지용)
  path text        -- 접속한 경로
);

-- 보안: 방문 통계는 클라이언트에서 Insert만 하고 권한은 어드민만 가져가도 무방합니다.
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to site_visits" ON public.site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read site_visits" ON public.site_visits FOR SELECT USING (true); -- 대시보드 조회를 위해 임시 허용
