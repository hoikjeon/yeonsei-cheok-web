import { type NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

// Next.js 16에서는 기존 middleware 약속이 proxy로 변경되었습니다.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

