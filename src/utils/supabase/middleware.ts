import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 여기서 세션 정보를 읽어옴으로써 자동으로 쿠키가 갱신됨
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 후기 '내용'은 회원에게만 노출합니다. 목록은 열어두고 상세·작성만 막습니다.
  if (!user && isMemberOnlyPath(request.nextUrl.pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    loginUrl.searchParams.set('reason', 'members-only');
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

// 목록 페이지는 누구나 볼 수 있고, 그 아래 하위 경로(상세·작성)만 회원 전용입니다.
// 예) /board/reviews → 공개, /board/reviews/{id}·/board/reviews/write → 회원 전용
const MEMBER_ONLY_PARENTS = ['/board/reviews'];

function isMemberOnlyPath(pathname: string) {
  return MEMBER_ONLY_PARENTS.some((parent) => {
    if (!pathname.startsWith(`${parent}/`)) return false;
    // '/board/reviews/' 처럼 하위 경로가 비어 있으면 목록으로 취급합니다.
    return pathname.length > parent.length + 1;
  });
}
