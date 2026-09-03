-- 회원 전용 1:1 온라인 상담 게시판
-- Supabase SQL Editor에서 1회 실행하세요.
-- 기존 consultations 테이블은 빠른 상담/콜백 신청용으로 그대로 유지합니다.

CREATE TABLE IF NOT EXISTS public.consultation_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  phone text,
  consultation_type text NOT NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 100),
  content text NOT NULL CHECK (char_length(content) BETWEEN 10 AND 5000),
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'answered')),
  answer text CHECK (answer IS NULL OR char_length(answer) BETWEEN 1 AND 5000),
  answered_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS consultation_posts_created_at_idx
  ON public.consultation_posts (created_at DESC);

CREATE INDEX IF NOT EXISTS consultation_posts_user_created_at_idx
  ON public.consultation_posts (user_id, created_at DESC);

ALTER TABLE public.consultation_posts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.consultation_posts FROM anon;
REVOKE ALL ON TABLE public.consultation_posts FROM authenticated;
GRANT SELECT, INSERT ON TABLE public.consultation_posts TO authenticated;

DROP POLICY IF EXISTS "Members can read own consultation posts" ON public.consultation_posts;
CREATE POLICY "Members can read own consultation posts"
  ON public.consultation_posts
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Members can create own consultation posts" ON public.consultation_posts;
CREATE POLICY "Members can create own consultation posts"
  ON public.consultation_posts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- 제목 목록은 비회원에게도 보이지만, 이 함수는 민감한 본문·연락처·회원 ID를 절대 반환하지 않습니다.
CREATE OR REPLACE FUNCTION public.list_consultation_titles(
  search_term text DEFAULT '',
  page_offset integer DEFAULT 0,
  page_limit integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  status text,
  created_at timestamp with time zone,
  total_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    post.id,
    post.title,
    post.status,
    post.created_at,
    count(*) OVER () AS total_count
  FROM public.consultation_posts AS post
  WHERE
    coalesce(btrim(search_term), '') = ''
    OR post.title ILIKE '%' || replace(replace(btrim(search_term), '%', '\%'), '_', '\_') || '%' ESCAPE '\'
  ORDER BY post.created_at DESC
  OFFSET greatest(page_offset, 0)
  LIMIT least(greatest(page_limit, 1), 50);
$$;

REVOKE ALL ON FUNCTION public.list_consultation_titles(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_consultation_titles(text, integer, integer) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_consultation_public_title(post_id uuid)
RETURNS TABLE (
  id uuid,
  title text,
  status text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT post.id, post.title, post.status, post.created_at
  FROM public.consultation_posts AS post
  WHERE post.id = post_id
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_consultation_public_title(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_consultation_public_title(uuid) TO anon, authenticated;

