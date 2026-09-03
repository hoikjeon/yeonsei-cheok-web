'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertCircle, ArrowLeft, LockKeyhole, Send } from 'lucide-react';
import { createConsultationPost } from '@/app/(public)/consultation/actions';
import { CONSULTATION_TOPICS, PRIVACY_CONSENT_TEXT } from '@/lib/consultationForm';

type ConsultationWriteFormProps = {
  memberName: string;
  memberPhone?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-13 flex-[2] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-[16px] font-bold text-white shadow-lg shadow-primary/15 transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      <Send size={18} />
      {pending ? '등록 중...' : '상담 등록'}
    </button>
  );
}

export default function ConsultationWriteForm({
  memberName,
  memberPhone,
}: ConsultationWriteFormProps) {
  const [state, formAction] = useActionState(
    createConsultationPost,
    {},
  );

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-5 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <p className="text-[13px] font-bold text-ink-muted">작성자</p>
          <p className="mt-1 text-[16px] font-bold text-ink">{memberName}</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-ink-muted">연락처</p>
          <p className="mt-1 text-[16px] font-bold text-ink">
            {memberPhone || '회원정보에 연락처가 없습니다.'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="consultationType" className="block text-[15px] font-bold text-ink">
          상담 분야 <span className="text-red-500">*</span>
        </label>
        <select
          id="consultationType"
          name="consultationType"
          required
          defaultValue=""
          className="min-h-13 w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-[16px] font-medium text-ink outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/10"
        >
          <option value="" disabled>상담 분야를 선택해 주세요</option>
          {CONSULTATION_TOPICS.map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="title" className="text-[15px] font-bold text-ink">
            제목 <span className="text-red-500">*</span>
          </label>
          <span className="text-[13px] font-bold text-primary">제목은 모든 방문자에게 공개됩니다.</span>
        </div>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={2}
          maxLength={100}
          placeholder="개인정보나 상세한 증상은 제목에 적지 말아 주세요."
          className="min-h-13 w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-[16px] font-medium text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/10"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="content" className="block text-[15px] font-bold text-ink">
          상담 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={10}
          maxLength={5000}
          rows={13}
          placeholder={'증상이 시작된 시점, 통증 위치, 기존 검사·치료 이력과 궁금한 점을 자세히 적어 주세요.\n\n상담 내용은 작성자 본인과 병원 관리자만 확인할 수 있습니다.'}
          className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-4 text-[16px] font-medium leading-7 text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/10"
        />
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink-muted">
          <LockKeyhole size={14} className="text-primary" /> 본문과 답변은 로그인한 작성자 본인만 볼 수 있습니다.
        </p>
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-7">
        <details className="rounded-lg border border-slate-200 bg-slate-50">
          <summary className="cursor-pointer px-4 py-3 text-[14px] font-bold text-ink-sub sm:px-5">
            개인정보 수집 및 이용 내용 보기
          </summary>
          <div className="max-h-52 overflow-y-auto whitespace-pre-line border-t border-slate-200 px-4 py-4 text-[12px] font-medium leading-6 text-ink-muted sm:px-5">
            {PRIVACY_CONSENT_TEXT}
          </div>
        </details>
        <label className="flex cursor-pointer items-start gap-3 text-[14px] font-bold leading-6 text-ink">
          <input
            type="checkbox"
            name="privacyAgreed"
            required
            className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
          />
          <span>개인정보 및 민감정보 수집·이용에 동의합니다. <span className="text-red-500">(필수)</span></span>
        </label>
      </div>

      {state.error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-bold leading-6 text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-7 sm:flex-row">
        <Link
          href="/consultation"
          className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 px-6 py-4 text-[16px] font-bold text-ink-sub transition-colors hover:bg-slate-200"
        >
          <ArrowLeft size={18} /> 목록으로
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
