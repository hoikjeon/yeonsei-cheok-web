import 'server-only';

import { createHmac, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
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


const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

export type AdminCredentialCheck =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'mismatch' };

/**
 * 관리자 비밀번호 검증.
 * 비밀번호는 코드에 두지 않고 ADMIN_PASSWORD_HASH 환경변수의 scrypt 해시와 비교합니다.
 * 형식: scrypt:N:r:p:saltBase64Url:hashBase64Url
 * ('$' 를 쓰면 .env 로더가 $16384 를 변수 참조로 보고 값을 망가뜨립니다)
 *
 * 새 비밀번호 해시를 만들려면:
 *   node scripts/hash-admin-password.mjs '새비밀번호'
 */
export async function verifyAdminCredentials(
  id: unknown,
  password: unknown,
): Promise<AdminCredentialCheck> {
  const expectedId = process.env.ADMIN_ID || 'admin';
  const encoded = process.env.ADMIN_PASSWORD_HASH;

  // 해시가 없으면 로그인을 허용하지 않습니다. (예전처럼 코드에 적힌 값으로 되돌아가지 않도록)
  if (!encoded) return { ok: false, reason: 'not-configured' };
  if (typeof id !== 'string' || typeof password !== 'string') return { ok: false, reason: 'mismatch' };

  const [scheme, nRaw, rRaw, pRaw, saltRaw, hashRaw] = encoded.split(':');
  if (scheme !== 'scrypt' || !saltRaw || !hashRaw) return { ok: false, reason: 'not-configured' };

  const N = Number(nRaw);
  const r = Number(rRaw);
  const parallelization = Number(pRaw);
  if (!Number.isSafeInteger(N) || !Number.isSafeInteger(r) || !Number.isSafeInteger(parallelization)) {
    return { ok: false, reason: 'not-configured' };
  }

  const expectedHash = Buffer.from(hashRaw, 'base64url');
  const actualHash = await scrypt(password, Buffer.from(saltRaw, 'base64url'), expectedHash.length, {
    N,
    r,
    p: parallelization,
  });

  // 아이디가 틀려도 해시 계산을 건너뛰지 않아, 응답 시간으로 아이디를 추측할 수 없게 합니다.
  const idBuffer = Buffer.from(id);
  const expectedIdBuffer = Buffer.from(expectedId);
  const idMatches =
    idBuffer.length === expectedIdBuffer.length && timingSafeEqual(idBuffer, expectedIdBuffer);
  const passwordMatches =
    actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash);

  return idMatches && passwordMatches ? { ok: true } : { ok: false, reason: 'mismatch' };
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
