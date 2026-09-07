import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;

  // Vercel 등 프록시 뒤에서는 request.url의 호스트가 내부 주소일 수 있으므로
  // 전달된 호스트 헤더를 우선 사용합니다.
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? requestUrl.protocol.replace(':', '');
  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : requestUrl.origin;

  const code = searchParams.get('code');
  // 수파베이스에서 넘겨주는 type 확인 (비밀번호 재설정인 경우 recovery일 가능성 농후)
  const type = searchParams.get('type');
  // 기본 리다이렉트 경로 결정
  const requestedPath = searchParams.get('next') ?? '/';
  let next = requestedPath.startsWith('/') && !requestedPath.startsWith('//') ? requestedPath : '/';

  // 비밀번호 재설정 흐름인 경우 강제로 재설정 페이지로 안내
  if (type === 'recovery') {
    next = '/login/reset-password';
  }

  // 구글·카카오가 동의 거부나 설정 오류를 알려온 경우 (예: 카카오 이메일 동의 항목 미설정)
  const providerError = searchParams.get('error_description') ?? searchParams.get('error');
  if (providerError) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(providerError)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 성공 시 대상 경로로 리다이렉트 (type=recovery 인지 여부를 한 번 더 확실하게 체크)
      const redirectPath = type === 'recovery' ? '/login/reset-password' : next;
      return NextResponse.redirect(`${origin}${redirectPath}`);
    } else {
      // 인증 교환 실패 시 오류 내용을 URL에 담아 리다이렉트 (디버깅용)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  // 코드가 없을 때 (해시 모드거나 잘못된 접근)
  return NextResponse.redirect(`${origin}/login?error=no_code_found`);
}
