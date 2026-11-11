import 'server-only';

import { SITE_URL, absoluteUrl } from '@/lib/seo';

// IndexNow: 새 글이나 고친 글의 주소를 검색엔진에 바로 알리는 공개 규약입니다.
// 네이버·빙 등이 받아 주며, 크롤러가 찾아올 때까지 기다리지 않고 수집을 요청할 수 있습니다.
//
// 키는 비밀 값이 아닙니다. 같은 값을 담은 파일(public/<키>.txt)이 사이트에 공개되어 있어야
// 검색엔진이 "이 사이트가 보낸 요청이 맞다"고 확인합니다. 키를 바꾸면 그 파일 이름과 내용도 같이 바꿉니다.
export const INDEXNOW_KEY = 'c403158c0fa8a735b973b3123c774955';

const ENDPOINTS = ['https://api.indexnow.org/indexnow', 'https://searchadvisor.naver.com/indexnow'];

/**
 * 바뀐 페이지 주소를 검색엔진에 알립니다. 실패해도 글 저장에는 영향을 주지 않습니다.
 * 실제 운영 사이트에서만 보냅니다(로컬·미리보기 배포에서는 아무 것도 보내지 않습니다).
 */
export async function notifySearchEngines(paths: string[]) {
  const urlList = [...new Set(paths)].map((path) => absoluteUrl(path));
  if (!urlList.length || process.env.VERCEL_ENV !== 'production') return { sent: false, urls: urlList };

  const body = JSON.stringify({
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: absoluteUrl(`/${INDEXNOW_KEY}.txt`),
    urlList,
  });
  await Promise.all(ENDPOINTS.map(async (endpoint) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) console.error(`IndexNow ${new URL(endpoint).host} responded ${response.status}`);
    } catch (error) {
      console.error(`IndexNow ${new URL(endpoint).host} failed:`, error instanceof Error ? error.message : error);
    }
  }));
  return { sent: true, urls: urlList };
}
