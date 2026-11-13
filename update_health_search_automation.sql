-- setup_health_articles.sql, update_health_articles_scheduling.sql 실행 후 적용.
-- Supabase SQL Editor에서 실행. 본문·공개 상태는 변경하지 않습니다.
BEGIN;

CREATE TABLE IF NOT EXISTS public.health_search_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('public', 'removed')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'accepted', 'key_pending', 'failed', 'cancelled')),
  available_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  lease_token uuid,
  locked_until timestamptz,
  last_http_status integer,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS health_search_jobs_due_idx ON public.health_search_jobs(status, available_at);
CREATE INDEX IF NOT EXISTS health_search_jobs_slug_idx ON public.health_search_jobs(slug);

CREATE TABLE IF NOT EXISTS public.health_search_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id uuid NOT NULL REFERENCES public.health_search_jobs(id),
  attempted_at timestamptz NOT NULL DEFAULT now(),
  http_status integer,
  outcome text NOT NULL,
  detail text NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS public.health_search_checks (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  checked_at timestamptz NOT NULL DEFAULT now(),
  ok boolean NOT NULL,
  report jsonb NOT NULL
);
ALTER TABLE public.health_search_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_search_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_search_checks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.health_search_jobs, public.health_search_attempts, public.health_search_checks FROM anon, authenticated;
GRANT ALL ON public.health_search_jobs, public.health_search_attempts, public.health_search_checks TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.health_search_attempts_id_seq, public.health_search_checks_id_seq TO service_role;

-- 모든 저장 경로(관리자·자동 작성·직접 DB 수정)의 수정 시각과 전송 대기열을 함께 기록.
CREATE OR REPLACE FUNCTION public.health_search_before_write() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at := clock_timestamp();
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS health_search_timestamp ON public.health_articles;
CREATE TRIGGER health_search_timestamp BEFORE UPDATE ON public.health_articles
FOR EACH ROW EXECUTE FUNCTION public.health_search_before_write();

CREATE OR REPLACE FUNCTION public.health_search_enqueue() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  article_slug text;
  was_public boolean := false;
BEGIN
  IF TG_OP = 'DELETE' THEN article_slug := OLD.slug; ELSE article_slug := NEW.slug; END IF;
  IF TG_OP <> 'INSERT' THEN was_public := OLD.is_published AND OLD.publish_at <= now(); END IF;
  UPDATE public.health_search_jobs SET status = 'cancelled', updated_at = now()
    WHERE slug = article_slug AND status IN ('pending', 'processing');
  -- 임시저장·예약 취소는 검색엔진에 알리지 않습니다.
  IF was_public AND (TG_OP = 'DELETE' OR NOT NEW.is_published OR NEW.publish_at > now()) THEN
    INSERT INTO public.health_search_jobs(slug, kind, available_at) VALUES (article_slug, 'removed', now());
  END IF;
  IF TG_OP <> 'DELETE' AND NEW.is_published THEN
    INSERT INTO public.health_search_jobs(slug, kind, available_at)
      VALUES (article_slug, 'public', greatest(now(), NEW.publish_at));
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $$;
DROP TRIGGER IF EXISTS health_search_outbox ON public.health_articles;
CREATE TRIGGER health_search_outbox AFTER INSERT OR UPDATE OR DELETE ON public.health_articles
FOR EACH ROW EXECUTE FUNCTION public.health_search_enqueue();

-- 겹친 Cron/관리자 요청은 같은 작업을 동시에 가져갈 수 없습니다. 중단된 작업은 5분 후 회수.
CREATE OR REPLACE FUNCTION public.claim_health_search_jobs(batch_size integer DEFAULT 20, only_slug text DEFAULT NULL)
RETURNS SETOF public.health_search_jobs
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  WITH due AS (
    SELECT id FROM public.health_search_jobs
    WHERE ((status = 'pending' AND available_at <= now())
      OR (status = 'processing' AND locked_until <= now()))
      AND (only_slug IS NULL OR slug = only_slug)
    ORDER BY available_at, created_at
    LIMIT least(greatest(batch_size, 1), 20)
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.health_search_jobs j SET status = 'processing', attempts = attempts + 1,
    lease_token = gen_random_uuid(), locked_until = now() + interval '5 minutes', updated_at = now()
    FROM due WHERE j.id = due.id RETURNING j.*;
$$;

CREATE OR REPLACE FUNCTION public.finish_health_search_job(
  job_id uuid, token uuid, outcome text, http_status integer, detail text, retry_at timestamptz DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF outcome NOT IN ('pending', 'accepted', 'key_pending', 'failed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid outcome';
  END IF;
  UPDATE public.health_search_jobs SET status = outcome, last_http_status = http_status,
    last_error = left(detail, 1000), available_at = coalesce(retry_at, available_at),
    locked_until = NULL, lease_token = NULL, updated_at = now()
    WHERE id = job_id AND lease_token = token AND status = 'processing';
  IF NOT FOUND THEN RETURN false; END IF;
  INSERT INTO public.health_search_attempts(job_id, http_status, outcome, detail)
    VALUES (job_id, http_status, outcome, left(detail, 1000));
  RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.health_search_before_write(), public.health_search_enqueue(),
  public.claim_health_search_jobs(integer, text),
  public.finish_health_search_job(uuid, uuid, text, integer, text, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_health_search_jobs(integer, text),
  public.finish_health_search_job(uuid, uuid, text, integer, text, timestamptz) TO service_role;

-- 이미 공개된 과거 글의 무차별 재전송 없이, 아직 공개 전인 예약 글만 등록합니다.
INSERT INTO public.health_search_jobs(slug, kind, available_at)
  SELECT a.slug, 'public', a.publish_at FROM public.health_articles a
  WHERE a.is_published AND a.publish_at > now()
    AND NOT EXISTS (SELECT 1 FROM public.health_search_jobs j
      WHERE j.slug = a.slug AND j.status IN ('pending', 'processing'));
COMMIT;
