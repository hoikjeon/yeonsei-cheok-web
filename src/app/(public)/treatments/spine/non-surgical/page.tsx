import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import SubHero from "@/components/SubHero";
import NonSurgicalTreatmentTabs from "@/components/NonSurgicalTreatmentTabs";

export default function NonSurgicalPage() {
  return (
    <div className="flex flex-col bg-white">
      <SubHero
        title="비수술 치료"
        subtitle="선진화된 기술력과 노하우로 절개 없이 통증의 원인을 정확히 겨냥해, 불편한 증상으로부터 벗어나 편안하고 건강한 일상으로의 복귀를 앞당깁니다."
        path={[
          { name: "척추센터", href: "/treatments/spine" },
          { name: "비수술 치료" },
        ]}
      />

      <main className="w-full">
        <section className="bg-[#F5F7FA] px-5 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-7xl">
            <NonSurgicalTreatmentTabs />
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <ScrollReveal className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-lg border border-slate-200 bg-white lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-4 p-8 md:p-10 lg:p-12">
              <h2 className="break-keep text-3xl font-bold leading-tight text-ink md:text-4xl">
                수술이 부담된다면, 비수술 치료부터 확인하세요
              </h2>
              <p className="max-w-2xl break-keep text-lg font-medium leading-relaxed text-ink-sub">
                검사 자료와 증상을 바탕으로 내 상태에 맞는 비수술 치료 가능
                여부를 전문의가 안내해 드립니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 p-8 md:flex-row md:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-7 py-4 text-base font-bold text-white transition-all hover:bg-primary-dark"
              >
                진료 예약하기
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-7 py-4 text-base font-bold text-ink transition-all hover:border-primary hover:text-primary"
              >
                온라인 상담하기
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </div>
  );
}
