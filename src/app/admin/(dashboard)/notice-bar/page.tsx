'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, Eye, Link2, Megaphone, Plus, Save, Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
  DEFAULT_HOME_NOTICE_SETTINGS,
  HOME_NOTICE_SETTINGS_ID,
  type HomeNoticeItem,
  type HomeNoticeSettings,
  normalizeHomeNoticeSettings,
} from '@/lib/homeNoticeSettings';
import { updateHomeNoticeSettings } from './actions';

type NoticeDraft = HomeNoticeItem;

function NoticeBarPreview({ settings }: { settings: HomeNoticeSettings }) {
  const notice = settings.notices[0] ?? DEFAULT_HOME_NOTICE_SETTINGS.notices[0];

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#17326F] via-[#284AA5] to-[#3C63C4] text-white shadow-[0_22px_60px_-34px_rgba(10,20,40,0.45)]">
      <div className="grid grid-cols-1 gap-4 px-5 py-5 xl:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] xl:items-center xl:gap-6">
        <div className="flex min-w-0 items-center">
          <div className="min-w-0">
            <p className="text-[13px] font-black text-white/70">공지사항</p>
            <p className="truncate text-[17px] font-black tracking-tight">{notice.title}</p>
          </div>
        </div>

        <div className="hidden h-10 w-px bg-white/35 xl:block" />

        <div className="flex min-w-0 items-center">
          <div className="min-w-0">
            <p className="text-[13px] font-black text-white/70">휴진일</p>
            <p className="truncate text-[17px] font-black tracking-tight">
              {settings.closed_month} · {settings.closed_message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminNoticeBarPage() {
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [isActive, setIsActive] = useState(DEFAULT_HOME_NOTICE_SETTINGS.is_active);
  const [notices, setNotices] = useState<NoticeDraft[]>(DEFAULT_HOME_NOTICE_SETTINGS.notices);
  const [closedMonth, setClosedMonth] = useState(DEFAULT_HOME_NOTICE_SETTINGS.closed_month);
  const [closedMessage, setClosedMessage] = useState(DEFAULT_HOME_NOTICE_SETTINGS.closed_message);

  const applySettings = useCallback((settings: HomeNoticeSettings) => {
    setIsActive(settings.is_active);
    setNotices(settings.notices);
    setClosedMonth(settings.closed_month);
    setClosedMessage(settings.closed_message);
  }, []);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setFetchError('');

    const { data, error } = await supabase
      .from('home_notice_settings')
      .select('*')
      .eq('id', HOME_NOTICE_SETTINGS_ID)
      .maybeSingle();

    if (error) {
      setFetchError('설정 테이블을 불러오지 못했습니다. setup_home_notice_bar.sql 적용 여부를 확인해주세요.');
      setIsLoading(false);
      return;
    }

    applySettings(normalizeHomeNoticeSettings(data));
    setIsLoading(false);
  }, [applySettings, supabase]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialSettings = async () => {
      const { data, error } = await supabase
        .from('home_notice_settings')
        .select('*')
        .eq('id', HOME_NOTICE_SETTINGS_ID)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        setFetchError('설정 테이블을 불러오지 못했습니다. setup_home_notice_bar.sql 적용 여부를 확인해주세요.');
        setIsLoading(false);
        return;
      }

      applySettings(normalizeHomeNoticeSettings(data));
      setIsLoading(false);
    };

    loadInitialSettings();

    return () => {
      isMounted = false;
    };
  }, [applySettings, supabase]);

  const previewSettings: HomeNoticeSettings = {
    id: HOME_NOTICE_SETTINGS_ID,
    is_active: isActive,
    notices: notices.filter((notice) => notice.title.trim()),
    closed_month: closedMonth || DEFAULT_HOME_NOTICE_SETTINGS.closed_month,
    closed_message: closedMessage || DEFAULT_HOME_NOTICE_SETTINGS.closed_message,
  };

  const addNotice = () => {
    setNotices((current) => {
      if (current.length >= 5) return current;
      return [...current, { title: '', href: '/news/notice' }];
    });
  };

  const removeNotice = (index: number) => {
    setNotices((current) => {
      if (current.length <= 1) return current;
      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const updateNotice = (index: number, key: keyof NoticeDraft, value: string) => {
    setNotices((current) =>
      current.map((notice, currentIndex) => (currentIndex === index ? { ...notice, [key]: value } : notice))
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const result = await updateHomeNoticeSettings(formData);

    if (result.error) {
      alert(`저장 실패: ${result.error}`);
    } else {
      alert('메인 공지사항/휴진일 설정이 저장되었습니다.');
      fetchSettings();
    }

    setIsSaving(false);
  };

  return (
    <>
      <header className="sticky top-0 z-[50] border-b border-slate-200 bg-white px-10 py-6 shadow-sm">
        <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-ink">
          <Megaphone className="text-primary" /> 메인 공지/휴진 관리
        </h1>
        <p className="mt-0.5 text-sm font-medium text-ink-muted">
          메인 화면 히어로 아래에 노출되는 공지사항과 월별 휴진 정보를 설정합니다.
        </p>
      </header>

      <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-10 p-10 xl:grid-cols-[minmax(0,1fr)_420px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          {fetchError && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-800">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{fetchError}</span>
            </div>
          )}

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink">노출 설정</h2>
                <p className="mt-1 text-sm font-medium text-ink-muted">비활성화하면 메인 화면에서 정보바가 숨겨집니다.</p>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-100 transition hover:bg-slate-100">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-black text-ink">사이트에 노출</span>
              </label>
            </div>

            {isLoading ? (
              <div className="rounded-2xl bg-slate-50 py-16 text-center text-sm font-black text-ink-muted">
                설정을 불러오는 중입니다...
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[17px] font-black text-ink">공지사항 항목</h3>
                    <p className="mt-0.5 text-sm font-medium text-ink-muted">최대 5개까지 등록할 수 있고, 메인에서는 순차 노출됩니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addNotice}
                    disabled={notices.length >= 5}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white shadow-blue-glow transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  >
                    <Plus size={17} /> 추가
                  </button>
                </div>

                <div className="space-y-4">
                  {notices.map((notice, index) => (
                    <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-primary ring-1 ring-slate-100">
                          Notice {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeNotice(index)}
                          disabled={notices.length <= 1}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted transition hover:bg-white hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label="공지사항 삭제"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                        <label className="space-y-2">
                          <span className="text-xs font-black uppercase tracking-wider text-ink-muted">공지 문구</span>
                          <input
                            required
                            name="notice_title"
                            value={notice.title}
                            onChange={(event) => updateNotice(index, 'title', event.target.value)}
                            placeholder="[정상진료] 7.17(금) 제헌절 / 8.17(월) 대체공휴일"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-primary"
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-ink-muted">
                            <Link2 size={13} /> 링크
                          </span>
                          <input
                            name="notice_href"
                            value={notice.href}
                            onChange={(event) => updateNotice(index, 'href', event.target.value)}
                            placeholder="/news/notice"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink-sub outline-none transition focus:border-primary"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 border-b border-slate-100 pb-5">
              <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-ink">
                <CalendarDays className="text-[#284AA5]" /> 휴진일 설정
              </h2>
              <p className="mt-1 text-sm font-medium text-ink-muted">월 표기와 휴진 상태 문구를 관리합니다.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-ink-muted">표시 월</span>
                <input
                  required
                  name="closed_month"
                  value={closedMonth}
                  onChange={(event) => setClosedMonth(event.target.value)}
                  placeholder="2026년 06월"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-primary"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-ink-muted">휴진 문구</span>
                <input
                  required
                  name="closed_message"
                  value={closedMessage}
                  onChange={(event) => setClosedMessage(event.target.value)}
                  placeholder="휴진일이 없습니다."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-primary"
                />
              </label>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="inline-flex min-w-44 items-center justify-center gap-2 rounded-2xl bg-navy-950 px-7 py-4 text-[15px] font-black text-white shadow-premium transition hover:-translate-y-0.5 hover:bg-primary disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              <Save size={18} /> {isSaving ? '저장 중...' : '설정 저장'}
            </button>
          </div>
        </form>

        <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-premium">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Eye size={19} />
              </span>
              <div>
                <h2 className="text-lg font-black tracking-tight text-ink">메인 노출 미리보기</h2>
                <p className="text-xs font-bold text-ink-muted">첫 번째 공지 기준으로 표시됩니다.</p>
              </div>
            </div>
            <NoticeBarPreview settings={previewSettings} />
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-black tracking-tight text-ink">제작 플랜</h2>
            <div className="mt-5 space-y-4">
              {[
                '메인 히어로 아래 정보바 배치',
                '공지사항 최대 5개 순차 노출',
                '월별 휴진 상태 문구 관리',
                '저장 즉시 메인/관리자 화면 갱신',
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-ink-sub">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
