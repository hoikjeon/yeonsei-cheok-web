import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, LockKeyhole, MessageSquareText } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

type ConsultationPost = {
  id: string;
  user_id: string;
  author_name: string;
  consultation_type: string;
  title: string;
  content: string;
  status: 'received' | 'answered';
  answer: string | null;
  answered_at: string | null;
  created_at: string;
};

type PublicTitle = Pick<ConsultationPost, 'id' | 'title' | 'status' | 'created_at'>;

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc('get_consultation_public_title', { post_id: id });
  const publicTitle = (data?.[0] || null) as PublicTitle | null;

  return {
    title: publicTitle ? `${publicTitle.title} | 온라인 상담` : '온라인 상담',
    description: '상담 내용은 로그인한 작성자 본인만 확인할 수 있습니다.',
    robots: { index: false, follow: false, noarchive: true },
  };
}

export default async function ConsultationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/consultation/${id}`)}&reason=consultation-private`);
  }

  const { data: ownPost } = await supabase
    .from('consultation_posts')
    .select('id,user_id,author_name,consultation_type,title,content,status,answer,answered_at,created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!ownPost) {
    const { data: publicData } = await supabase.rpc('get_consultation_public_title', { post_id: id });
    const publicTitle = (publicData?.[0] || null) as PublicTitle | null;
    if (!publicTitle) notFound();

    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:px-10 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
            <LockKeyhole size={26} />
          </div>
          <p className="mt-6 text-[13px] font-bold text-primary">비공개 1:1 상담</p>
          <h1 className="mt-2 break-keep text-h3 tracking-tight text-ink">{publicTitle.title}</h1>
          <p className="mx-auto mt-5 max-w-xl break-keep text-body leading-7 text-ink-muted">
            이 상담의 본문과 답변은 작성자 본인만 확인할 수 있습니다.
            상담을 작성한 계정으로 로그인했는지 확인해 주세요.
          </p>
          <Link href="/consultation" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-navy-950 px-7 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-primary">
            <ArrowLeft size={18} /> 목록으로
          </Link>
        </div>
      </main>
    );
  }

  const post = ownPost as ConsultationPost;
  const isAnswered = post.status === 'answered' && Boolean(post.answer);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 px-5 py-7 sm:px-9 sm:py-9">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-md px-3 py-1.5 text-[12px] font-bold ${isAnswered ? 'bg-primary text-white' : 'bg-slate-100 text-ink-muted'}`}>
              {isAnswered ? '답변완료' : '접수완료'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-primary">
              <LockKeyhole size={14} /> 작성자 본인만 열람 가능
            </span>
          </div>
          <h1 className="mt-4 break-keep text-h2 tracking-tight text-ink">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-ink-muted sm:text-[14px]">
            <span>{post.consultation_type}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={16} /> {formatDate(post.created_at)}</span>
          </div>
        </header>

        <div className="space-y-10 px-5 py-8 sm:px-9 sm:py-10">
          <section aria-labelledby="question-title">
            <h2 id="question-title" className="flex items-center gap-2 text-h4 text-ink">
              <MessageSquareText size={20} className="text-primary" /> 상담 내용
            </h2>
            <div className="mt-4 min-h-44 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 px-5 py-5 text-[16px] font-medium leading-8 text-ink-sub sm:px-6 sm:py-6">
              {post.content}
            </div>
          </section>

          <section aria-labelledby="answer-title">
            <h2 id="answer-title" className="flex items-center gap-2 text-h4 text-ink">
              {isAnswered ? <CheckCircle2 size={20} className="text-primary" /> : <Clock3 size={20} className="text-slate-400" />}
              병원 답변
            </h2>
            {isAnswered ? (
              <div className="mt-4 rounded-lg border border-primary/15 bg-primary-light/40 px-5 py-5 sm:px-6 sm:py-6">
                <div className="whitespace-pre-wrap text-[16px] font-medium leading-8 text-ink-sub">{post.answer}</div>
                {post.answered_at && (
                  <p className="mt-5 border-t border-primary/10 pt-4 text-[13px] font-medium text-ink-muted">
                    답변일 {formatDate(post.answered_at)}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white px-5 py-8 text-center">
                <p className="text-[16px] font-bold text-ink">전문 상담사가 내용을 확인하고 있습니다.</p>
                <p className="mt-2 text-[14px] font-medium text-ink-muted">답변이 등록되면 이 화면에서 확인할 수 있습니다.</p>
              </div>
            )}
          </section>
        </div>

        <footer className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-9">
          <Link href="/consultation" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-[14px] font-bold text-ink-sub ring-1 ring-slate-200 transition-colors hover:text-primary">
            <ArrowLeft size={17} /> 목록으로 돌아가기
          </Link>
        </footer>
      </article>
    </main>
  );
}

