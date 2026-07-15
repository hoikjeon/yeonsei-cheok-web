'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

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

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const buttonClass =
    variant === 'dark'
      ? 'h-12 rounded-md border-white/50 bg-transparent px-5 text-white hover:border-white focus:ring-white/30'
      : 'h-[58px] rounded-xl border-slate-200 bg-white px-5 text-ink hover:border-primary/50 focus:ring-primary/15';

  const mutedTextClass = variant === 'dark' ? 'text-white/92' : 'text-ink-muted';
  const panelClass =
    variant === 'dark'
      ? 'left-0 w-[286px] max-w-[calc(100vw-48px)]'
      : 'right-0 w-[300px] max-w-[calc(100vw-32px)] md:left-0 md:right-auto md:w-full md:min-w-[300px] md:max-w-[calc(100vw-48px)]';

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
    <div ref={pickerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className={`flex w-full min-w-0 items-center justify-between border text-left text-[15px] font-medium transition-colors focus:outline-none focus:ring-2 ${buttonClass}`}
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
        <div className={`absolute top-[calc(100%+1px)] z-[95] overflow-hidden rounded-md border border-slate-200 bg-white text-ink shadow-[0_22px_54px_-34px_rgba(10,20,40,0.7)] ${panelClass}`}>
          <div className="flex h-[52px] items-center justify-between bg-[#162d5f] px-4 text-white">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              disabled={!canGoPrevMonth}
              className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="이전 달"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-[16px] font-black">
              {viewDate.getFullYear()} / {pad(viewDate.getMonth() + 1)}
            </div>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-white/12"
              aria-label="다음 달"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 px-3 pt-4 text-center text-[13px] font-bold text-ink-sub">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className="py-1">
                {weekday}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 px-3 pb-4 pt-3">
            {monthCells.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="h-9" />;

              const dateValue = toDateValue(date);
              const isPast = date < today;
              const isSelected = value === dateValue;
              const isToday = dateValue === toDateValue(today);

              return (
                <button
                  key={dateValue}
                  type="button"
                  onClick={() => selectDate(date)}
                  disabled={isPast}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-medium transition-all ${
                    isSelected
                      ? 'bg-[#162d5f] text-white shadow-[0_10px_24px_-18px_rgba(22,45,95,0.85)]'
                      : isPast
                        ? 'cursor-not-allowed text-slate-300'
                        : 'text-ink-sub hover:bg-slate-100 hover:text-primary'
                  } ${isToday && !isSelected ? 'ring-1 ring-primary/30' : ''}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
