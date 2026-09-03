#!/usr/bin/env node
// 관리자 비밀번호 해시 생성기
//
//   node scripts/hash-admin-password.mjs '새비밀번호'
//
// 출력된 ADMIN_PASSWORD_HASH 값을 .env.local 과 Vercel 환경변수에 넣으세요.
// 비밀번호 자체는 코드나 저장소에 남기지 않습니다.

import { randomBytes, scryptSync } from 'node:crypto';

const password = process.argv[2];

if (!password) {
  console.error("사용법: node scripts/hash-admin-password.mjs '새비밀번호'");
  process.exit(1);
}

if (password.length < 4) {
  console.error('비밀번호가 너무 짧습니다.');
  process.exit(1);
}

const N = 16384;
const r = 8;
const p = 1;
const keylen = 64;

const salt = randomBytes(16);
const hash = scryptSync(password, salt, keylen, { N, r, p });

// 구분자로 ':' 를 씁니다. '$' 는 .env 로더가 변수 참조로 해석해 값이 깨집니다.
const encoded = ['scrypt', N, r, p, salt.toString('base64url'), hash.toString('base64url')].join(':');

console.log('ADMIN_PASSWORD_HASH=' + encoded);

if (password.length < 10) {
  console.error('\n※ 비밀번호가 10자 미만입니다. 더 길게 쓰시는 것을 권합니다.');
}
