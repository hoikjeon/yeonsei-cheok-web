'use client';

import Image from 'next/image';

export interface MobileDiseaseMapMarker<T extends string> {
  id: T;
  title: string;
  point: { left: string; top: string };
}

interface MobileDiseaseMapProps<T extends string> {
  imageSrc: string;
  imageAlt: string;
  markers: ReadonlyArray<MobileDiseaseMapMarker<T>>;
  onSelect: (id: T) => void;
  aspectRatio?: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: string;
}

const MobileDiseaseMap = <T extends string>({
  imageSrc,
  imageAlt,
  markers,
  onSelect,
  aspectRatio = '4 / 3',
  imageFit = 'cover',
  imagePosition = 'center',
}: MobileDiseaseMapProps<T>) => (
  <div className="mt-5 lg:hidden">
    <div
      className="relative w-full overflow-hidden rounded-xl bg-[#F8FAFD] ring-1 ring-slate-100"
      style={{ aspectRatio }}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="calc(100vw - 72px)"
        className={imageFit === 'cover' ? 'object-cover opacity-90' : 'object-contain opacity-90'}
        style={{ objectPosition: imagePosition }}
      />

      {markers.map((marker, index) => (
        <button
          key={marker.id}
          type="button"
          onClick={() => onSelect(marker.id)}
          aria-label={`${index + 1}번 ${marker.title} 자세히 보기`}
          className="absolute z-20 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none transition active:scale-95 focus-visible:ring-4 focus-visible:ring-primary/25"
          style={marker.point}
        >
          <span
            aria-hidden="true"
            className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[11px] font-extrabold leading-none text-white shadow-[0_5px_14px_rgba(38,84,190,0.28)] ring-4 ring-primary/15"
          >
            {index + 1}
          </span>
        </button>
      ))}
    </div>

    <div className="mt-3 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
      {markers.map((marker, index) => (
        <button
          key={marker.id}
          type="button"
          onClick={() => onSelect(marker.id)}
          className="flex min-h-11 items-center gap-2.5 rounded-xl border border-primary/15 bg-white px-3 py-2.5 text-left text-[13px] font-bold leading-[1.35] text-slate-700 shadow-sm outline-none transition active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <span
            aria-hidden="true"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-extrabold leading-none text-white"
          >
            {index + 1}
          </span>
          <span className="break-keep">{marker.title}</span>
        </button>
      ))}
    </div>
  </div>
);

export default MobileDiseaseMap;
