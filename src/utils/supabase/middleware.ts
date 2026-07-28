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

  // 의료법상 치료경험담(후기)은 회원에게만 노출할 수 있으므로 비로그인 접근을 차단합니다.
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

// 로그인한 회원만 접근할 수 있는 경로
const MEMBER_ONLY_PATHS = ['/board/reviews'];

function isMemberOnlyPath(pathname: string) {
  return MEMBER_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
