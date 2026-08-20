import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

const staticPages: Array<{
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/about/equipment', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about/location', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/doctors', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/treatments', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/treatments/spine', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/treatments/spine/disc', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/treatments/spine/neck-disc', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/treatments/spine/non-surgical', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/treatments/spine/rehab', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/treatments/spine/stenosis', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/treatments/spine/ube', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/treatments/joint/knee', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/treatments/joint/knee-arthroscopy', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/treatments/joint/shoulder', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/treatments/joint/wrist-ankle', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/news/notice', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/news/media', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/news/academic', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/news/training', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/news/youtube', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/board/faq', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/board/certificates', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/non-covered', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/consultation', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/reservation', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/cctv', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/rights', changeFrequency: 'yearly', priority: 0.3 },
];

const newsRouteByType: Record<string, string> = {
  academic: 'academic',
  media: 'media',
  notice: 'notice',
  notice_pinned: 'notice',
  training: 'training',
  youtube: 'youtube',
};

async function getNewsEntries(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) return [];

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from('hospital_news')
    .select('id,type,created_at')
    .in('type', Object.keys(newsRouteByType))
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.flatMap((item) => {
    const route = newsRouteByType[item.type];
    if (!route) return [];

    return [
      {
        url: absoluteUrl(`/news/${route}/${item.id}`),
        lastModified: item.created_at,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ];
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: absoluteUrl(page.path),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return [...staticEntries, ...(await getNewsEntries())];
}
