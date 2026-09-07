import NewsContent from '@/components/NewsContent';
import { newsGalleryImages } from '@/lib/newsContent';

export default function ReviewArticlePreview({ category, title, content, images, mobile = false }: {
  category: string; title: string; content: string; images: string[]; mobile?: boolean;
}) {
  const gallery = newsGalleryImages(content, images);
  return <article className={`mx-auto w-full bg-white ${mobile ? 'max-w-[390px] px-5 py-7' : 'max-w-4xl p-5 sm:p-10'}`}>
    <p className="mb-3 text-sm font-bold text-primary">치료체험후기 · {category}</p>
    <h2 className={`break-words font-extrabold leading-snug text-slate-900 ${mobile ? 'text-2xl' : 'text-3xl'}`}>{title || '제목을 입력해주세요'}</h2>
    <hr className="my-8 border-slate-200" />
    {gallery.length > 0 && <div className="mb-8 space-y-6">{gallery.map((url, index) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={url} src={url} alt={`${title || '치료체험후기'} 첨부 이미지 ${index + 1}`} className="mx-auto h-auto max-w-full rounded-lg" />
    ))}</div>}
    <NewsContent content={content} className={mobile ? '!text-base' : ''} />
  </article>;
}
