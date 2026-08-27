import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24;

function getSigningSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    throw new Error('관리자 세션 서명 키가 설정되지 않았습니다.');
  }

  return secret;
}

function sign(payload: string) {
  return createHmac('sha256', getSigningSecret()).update(payload).digest('base64url');
}

function createSessionToken(expiresAt: number) {
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string | undefined) {
  if (!token) return false;

  const [role, expiresAtValue, signature, ...rest] = token.split('.');
  if (rest.length > 0 || role !== 'admin' || !expiresAtValue || !signature) return false;

  const expiresAt = Number(expiresAtValue);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return false;

  const expectedSignature = sign(`${role}.${expiresAtValue}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export async function createAdminSession() {
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(expiresAt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: '/',
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function requireAdmin(redirectPath = '/admin/login') {
  if (!(await isAdminAuthenticated())) {
    redirect(redirectPath);
  }
}
