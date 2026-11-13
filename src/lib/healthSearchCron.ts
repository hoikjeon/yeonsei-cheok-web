export function isHealthCronAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  // User-Agent는 위조할 수 있으므로 인증 수단으로 사용하지 않습니다.
  return Boolean(secret) && request.headers.get('authorization') === `Bearer ${secret}`;
}
