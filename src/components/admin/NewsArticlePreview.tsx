import NewsContent from '@/components/NewsContent';
import { newsGalleryImages, safeNewsLink, youtubeVideoId } from '@/lib/newsContent';
import { adminNewsConfig, type AdminNewsType } from '@/lib/adminNews';

export default function NewsArticlePreview({ type, title, content, images, videoUrl, sourceName, sourceUrl, mobile = false }: {
  type: AdminNewsType; title: string; content: string; images: string[]; videoUrl?: string | null;
  sourceName?: string | null; sourceUrl?: string | null; mobile?: boolean;
}) {
  const video = youtubeVideoId(videoUrl);
  const source = safeNewsLink(sourceUrl);
  const gallery = newsGalleryImages(content, images);
  return <article className={`mx-auto w-full bg-white ${mobile ? 'max-w-[390px] px-5 py-7' : 'max-w-4xl p-5 sm:p-10'}`}>
    <p className="mb-3 text-sm font-bold text-primary">{adminNewsConfig[type].label}</p>
    <h2 className={`break-words font-extrabold leading-snug text-slate-900 ${mobile ? 'text-2xl' : 'text-3xl'}`}>{title || '제목을 입력해주세요'}</h2>
    {type === 'media' && (sourceName || source) && <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
      {sourceName && <span>{sourceName}</span>}{source && <a href={source} target="_blank" rel="noopener noreferrer" className="text-primary underline">기사 원문 보기</a>}
    </div>}
    <hr className="my-8 border-slate-200" />
    {video && <iframe src={`https://www.youtube-nocookie.com/embed/${video}`} title={title || '유튜브 영상'} className="mb-8 aspect-video w-full rounded-xl" allowFullScreen />}
    {gallery.length > 0 && <div className="mb-8 space-y-6">{gallery.map((url, i) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={url} src={url} alt={`${title || '게시물'} 첨부 이미지 ${i + 1}`} className="mx-auto h-auto max-w-full rounded-lg" />
    ))}</div>}
    <NewsContent content={content} className={mobile ? '!text-base' : ''} />
  </article>;
}
