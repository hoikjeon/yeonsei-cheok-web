-- 건강정보 예약 발행·자동 작성용 변경 (setup_health_articles.sql 을 먼저 실행한 뒤 실행합니다)
-- Supabase SQL Editor에서 이 파일만 실행하면 됩니다. 기존 글 내용은 그대로 둡니다.

-- 1) 발행 시각: 이 시각이 지나야 홈페이지에 보입니다. 기존 글은 게시일 오전 9시(한국 시간)로 채웁니다.
ALTER TABLE public.health_articles ADD COLUMN IF NOT EXISTS publish_at timestamp with time zone;
UPDATE public.health_articles
  SET publish_at = (published_at::timestamp + time '09:00') AT TIME ZONE 'Asia/Seoul'
  WHERE publish_at IS NULL;
ALTER TABLE public.health_articles ALTER COLUMN publish_at SET NOT NULL;
ALTER TABLE public.health_articles ALTER COLUMN publish_at SET DEFAULT now();

-- 2) 자동 작성 글은 의료진 검토 전이라 검토일이 비어 있을 수 있습니다.
ALTER TABLE public.health_articles ALTER COLUMN reviewed_at DROP NOT NULL;

-- 3) 글 출처: manual(관리자 작성) / auto(자동 작성)
ALTER TABLE public.health_articles ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual'
  CHECK (source IN ('manual', 'auto'));

CREATE INDEX IF NOT EXISTS health_articles_publish_at_idx
  ON public.health_articles (is_published, publish_at DESC);

-- 4) 방문자는 공개 글 중 발행 시각이 지난 글만 읽을 수 있습니다.
DROP POLICY IF EXISTS "Anyone can read published health articles" ON public.health_articles;
CREATE POLICY "Anyone can read published health articles"
  ON public.health_articles
  FOR SELECT
  TO anon, authenticated
  USING (is_published AND publish_at <= now());

-- 5) 자동 작성 주제 대기열. 관리자 페이지에서 넣고, 자동화 스크립트가 하나씩 꺼내 씁니다.
--    방문자에게는 보이지 않습니다(서버의 service role 만 읽고 씁니다).
CREATE TABLE IF NOT EXISTS public.health_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  category text CHECK (category IN ('spine', 'joint')),
  note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'done', 'failed')),
  article_slug text,
  error text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS health_topics_queue_idx ON public.health_topics (status, created_at);

ALTER TABLE public.health_topics ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.health_topics FROM anon, authenticated;
