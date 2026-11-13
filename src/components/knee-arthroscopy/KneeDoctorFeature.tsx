import Image from 'next/image';

const careers = [
  '경희의대 졸업',
  '경희의료원 정형외과 수련',
  '경희대학교 의과대학 외래교수',
  '경희대학교 의학전문원 실습지도교수',
  '좋은삼선병원 정형외과 수련 주임과장',
  '좋은강안병원 정형외과 주임과장',
  '롯데자이언츠 주치의',
  '국내·외 다수 논문 발표',
];

export default function KneeDoctorFeature() {
  return (
    <section aria-labelledby="knee-doctor-title" className="bg-[#F3F5F7] px-5 py-12 sm:px-6 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-16">
        <div className="relative order-2 mx-auto h-[360px] w-full max-w-[380px] md:order-1 md:h-[540px]">
          <Image
            src="/images/treatments/joint/knee-arthroscopy/doctor-choi-portrait.avif"
            alt="최호 정형외과 원장"
            fill
            sizes="(min-width: 768px) 380px, 90vw"
            className="object-contain object-bottom"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 id="knee-doctor-title" className="text-h2 tracking-tight text-[#102647]">관절센터 의료진</h2>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="text-[2rem] font-bold tracking-tight text-[#102647]">최호 원장</h3>
            <p className="text-base text-slate-600">정형외과 전문의</p>
          </div>
          <p className="mt-4 max-w-xl break-keep text-base leading-[1.8] text-ink-sub md:text-lg">
            진찰과 영상검사를 함께 검토하고, 관절경으로 확인한 병변의 위치와 범위에 맞춰 치료 방향을 세웁니다.
          </p>
          <div className="mt-7 border-t border-slate-300 pt-6">
            <h4 className="text-base font-semibold text-[#102647]">주요 약력</h4>
            <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {careers.map((career) => (
                <li key={career} className="break-keep text-sm leading-[1.8] text-slate-600">
                  {career}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
