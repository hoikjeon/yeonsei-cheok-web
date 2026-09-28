-- 비급여 장 제목 번호 정리 (1회성).
-- setup_non_covered.sql 을 이미 실행한 DB에서만 필요합니다. 새로 설치하는 DB는 이미 정리된 제목으로 들어갑니다.
-- Supabase SQL Editor에서 전체 실행. 여러 번 실행해도 안전하며, 바꿀 것이 없으면 아무것도 하지 않습니다.
--
-- 건강보험 행위 목록의 장 번호(2장 검사료, 7장, 9장 …)와 비급여 큰 분류 번호(2장 치료재료대 …)가
-- 섞여 있던 것을 한 체계로 맞춥니다. 항목·금액·기준일은 바꾸지 않습니다.
--   · 행위료 아래 장은 "1-1." ~ "1-7." 작은 제목으로
--   · '기타'(식대·환의)는 맨 뒤 "5. 기타"로
--   · 분류가 '기타' 하나뿐인 약제비·제증명료는 분류 이름을 '약제'·'제증명'으로
-- 관리자가 이미 다른 이름으로 바꾼 장은 건드리지 않습니다.
DO $$
DECLARE
  titles constant jsonb := '{
    "1장. 행위료": "1. 행위료",
    "1-1장. 상급병실료 차액": "1-1. 상급병실료 차액",
    "2장. 검사료": "1-2. 검사료",
    "2-1장. 초음파검사료": "1-3. 초음파 검사료",
    "3-1장. 초음파 영상료": "1-4. 초음파 영상료",
    "3-2장. 자기공명영상진단료": "1-5. 자기공명영상진단료(MRI)",
    "7장. 이학요법료(물리치료료)": "1-6. 이학요법료(물리치료료)",
    "9장. 처치 및 수술료": "1-7. 처치 및 수술료",
    "2장. 치료재료대": "2. 치료재료대",
    "3장. 약제비": "3. 약제비",
    "기타.": "5. 기타"
  }';
  sole_group_names constant jsonb := '{"3. 약제비": "약제", "4. 제증명료": "제증명"}';
  current_version integer;
  current_content jsonb;
  section jsonb;
  new_title text;
  etc_section jsonb;
  next_sections jsonb := '[]';
BEGIN
  SELECT version, content INTO current_version, current_content
    FROM public.non_covered_catalog WHERE id = 'main' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'CATALOG_NOT_INITIALIZED: setup_non_covered.sql 을 먼저 실행하세요.'; END IF;

  FOR section IN
    SELECT value FROM jsonb_array_elements(current_content->'sections') WITH ORDINALITY ORDER BY ordinality
  LOOP
    new_title := coalesce(titles->>(section->>'title'), section->>'title');
    section := jsonb_set(section, '{title}', to_jsonb(new_title));
    IF sole_group_names ? new_title
       AND jsonb_array_length(section->'groups') = 1
       AND section->'groups'->0->>'name' = '기타' THEN
      section := jsonb_set(section, '{groups,0,name}', to_jsonb(sole_group_names->>new_title));
    END IF;
    IF new_title = '5. 기타' THEN etc_section := section;
    ELSE next_sections := next_sections || jsonb_build_array(section);
    END IF;
  END LOOP;
  IF etc_section IS NOT NULL THEN next_sections := next_sections || jsonb_build_array(etc_section); END IF;

  IF next_sections = current_content->'sections' THEN
    RAISE NOTICE '비급여 장 제목이 이미 정리되어 있습니다. 변경 없음.';
    RETURN;
  END IF;

  -- 관리자 저장과 같은 함수로 저장해 버전이 오르고 변경 이력에 남습니다.
  -- 열려 있던 관리자 화면은 다음 저장 때 새로고침 안내를 받습니다.
  PERFORM public.save_non_covered_catalog(
    current_version,
    jsonb_set(current_content, '{sections}', next_sections),
    '분류 수정',
    '장 제목 번호 정리',
    (SELECT jsonb_agg(jsonb_build_object('id', s->>'id', 'title', s->>'title') ORDER BY n)
       FROM jsonb_array_elements(current_content->'sections') WITH ORDINALITY AS t(s, n)),
    (SELECT jsonb_agg(jsonb_build_object('id', s->>'id', 'title', s->>'title') ORDER BY n)
       FROM jsonb_array_elements(next_sections) WITH ORDINALITY AS t(s, n))
  );
  RAISE NOTICE '비급여 장 제목을 정리했습니다. 버전 % → %', current_version, current_version + 1;
END;
$$;
