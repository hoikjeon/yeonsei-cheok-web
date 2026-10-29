import type { MetadataRoute } from 'next';
import { SITE_URL, absoluteUrl } from '@/lib/seo';

// AI 검색(ChatGPT·Claude·Perplexity·Gemini 등)이 건강정보 글을 인용할 수 있도록 크롤러를 이름으로도 허용합니다.
const AI_CRAWLERS = [
  'Googlebot',
  'Google-Extended',
  'Bingbot',
  'OAI-SearchBot',
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Yeti',
  'Daum',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin'] },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: ['/admin'] },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
