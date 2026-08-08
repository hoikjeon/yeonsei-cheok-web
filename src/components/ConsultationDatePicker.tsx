'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';

type ConsultationDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: 'dark' | 'light';
  ariaLabel?: string;
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const pad = (value: number) => String(value).padStart(2, '0');

const toDateValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDateValue = (value: string) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatDateLabel = (value: string) => {
  const date = parseDateValue(value);
  if (!date) return '';
  return `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}`;
};

export default function ConsultationDatePicker({
  value,
  onChange,
  placeholder = '희망 날짜 *',
  variant = 'dark',
  ariaLabel = '희망 날짜',
}: ConsultationDatePickerProps) {
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const today = useMemo(() => startOfDay(new Date()), []);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? today);
  const pickerRef = useRef<HTMLDivElement>(null);

  const monthCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ];
  }, [viewDate]);

  const canGoPrevMonth = useMemo(() => {
    const previousMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return previousMonth >= currentMonth;
  }, [today, viewDate]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !window.matchMedia('(max-width: 639px)').matches) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const buttonClass =
    variant === 'dark'
      ? 'h-12 rounded-md border-white/50 bg-transparent px-5 text-white hover:border-white focus:ring-white/30'
      : 'h-[60px] rounded-xl border-slate-200 bg-white px-5 text-ink shadow-sm hover:border-primary/60 focus:border-primary focus:ring-primary/15';

  const mutedTextClass = variant === 'dark' ? 'text-white/92' : 'text-ink-muted';
  const panelClass =
    variant === 'dark'
      ? 'w-full max-w-[320px] sm:min-w-[286px]'
      : 'w-full max-w-[360px]';

  const handleToggle = () => {
    if (!isOpen) {
      setViewDate(selectedDate ?? today);
    }
    setIsOpen((current) => !current);
  };

  const moveMonth = (direction: -1 | 1) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  const selectDate = (date: Date) => {
    if (date < today) return;
    onChange(toDateValue(date));
    setIsOpen(false);
  };

  return (
    <div ref={pickerRef} className="relative font-sans">
      <button
        type="button"
        onClick={handleToggle}
        className={`flex w-full min-w-0 items-center justify-between border text-left text-[16px] font-semibold leading-none transition-colors focus:outline-none focus:ring-2 ${buttonClass}`}
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className={`block min-w-0 flex-1 truncate pr-3 ${value ? '' : mutedTextClass}`}>
          {value ? formatDateLabel(value) : placeholder}
        </span>
        <CalendarDays
          size={18}
          strokeWidth={1.8}
          className={`shrink-0 ${variant === 'dark' ? 'text-white/90' : 'text-primary'}`}
        />
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-navy-950/65 px-5 py-16 backdrop-blur-[2px] sm:absolute sm:inset-auto sm:left-0 sm:top-[calc(100%+10px)] sm:z-[95] sm:block sm:bg-transparent sm:p-0 sm:backdrop-blur-none"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="달력 닫기"
            className="absolute right-5 top-[calc(env(safe-area-inset-top)+1rem)] flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy-900 shadow-lg sm:hidden"
          >
            <X size={25} strokeWidth={2.2} />
          </button>

          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${ariaLabel} 달력`}
            className={`max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-ink shadow-[0_28px_70px_-28px_rgba(15,29,54,0.48)] ${panelClass}`}
          >
            <div className="flex min-h-[76px] items-center justify-between bg-primary px-3 text-white sm:px-4">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              disabled={!canGoPrevMonth}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="이전 달"
            >
              <ChevronLeft size={22} strokeWidth={2.2} />
            </button>
            <div className="text-center" aria-live="polite">
              <p className="text-[11px] font-semibold tracking-[0.08em] text-white/75">
                진료 희망일
              </p>
              <p className="mt-1 text-[18px] font-extrabold tracking-tight">
                {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
              </p>
            </div>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/20"
              aria-label="다음 달"
            >
              <ChevronRight size={22} strokeWidth={2.2} />
            </button>
          </div>

          <div className="grid grid-cols-7 px-4 pb-2 pt-5 text-center text-[13px] font-bold text-ink-sub">
            {WEEKDAYS.map((weekday, index) => (
              <div
                key={weekday}
                className={`py-1 ${
                  index === 0
                    ? 'text-rose-500'
                    : index === 6
                      ? 'text-primary'
                      : ''
                }`}
              >
                {weekday}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 px-4 pb-4 pt-1">
            {monthCells.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square w-full" />;
              }

              const dateValue = toDateValue(date);
              const isPast = date < today;
              const isSelected = value === dateValue;
              const isToday = dateValue === toDateValue(today);
              const dayOfWeek = date.getDay();
              const availableDateTone =
                dayOfWeek === 0
                  ? 'text-rose-500'
                  : dayOfWeek === 6
                    ? 'text-primary'
                    : 'text-ink';

              return (
                <button
                  key={dateValue}
                  type="button"
                  onClick={() => selectDate(date)}
                  disabled={isPast}
                  className={`relative mx-auto flex aspect-square w-full max-w-10 items-center justify-center rounded-xl text-[15px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-[0_10px_24px_-14px_rgba(40,74,165,0.75)]'
                      : isPast
                        ? 'cursor-not-allowed text-slate-300'
                        : `${availableDateTone} hover:bg-primary-light hover:text-primary`
                  } ${isToday && !isSelected ? 'bg-primary-light ring-1 ring-primary/35' : ''}`}
                  aria-label={`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일${isToday ? ', 오늘' : ''}`}
                >
                  {date.getDate()}
                  {isToday && !isSelected ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-[12px] font-semibold text-ink-muted">
              지난 날짜는 선택할 수 없습니다.
            </p>
            <button
              type="button"
              onClick={() => {
                setViewDate(today);
                selectDate(today);
              }}
              className="rounded-lg bg-white px-3 py-2 text-[13px] font-bold text-primary shadow-sm ring-1 ring-slate-200 transition hover:bg-primary hover:text-white"
            >
              오늘 선택
            </button>
          </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
