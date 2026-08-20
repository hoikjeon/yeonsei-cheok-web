import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: '환자의 권리와 의무 | 연세척병원',
  description:
    '연세척병원을 이용하는 환자가 보장받는 권리와 안전한 진료를 위해 지켜야 할 의무를 안내합니다.',
  path: '/rights',
});

const patientRights = [
  {
    title: '가. 진료받을 권리',
    description:
      '환자는 자신의 건강 보호와 증진을 위하여 적절한 보건의료서비스를 받을 권리가 있습니다. 성별·나이·장애·종교·신념·신분 및 경제적 사정 등을 이유로 차별받거나 건강에 관한 권리를 침해받지 않으며, 의료인은 정당한 사유 없이 진료를 거부하지 못합니다.',
  },
  {
    title: '나. 알권리 및 자기결정권',
    description:
      '환자는 담당 의사·간호사 등으로부터 질병 상태, 치료 방법, 의학적 연구 대상 여부, 장기이식 여부, 부작용 등 예상 결과 및 진료 비용에 관하여 충분한 설명을 듣고 자세히 물어볼 수 있으며, 이에 관한 동의 여부를 결정할 권리가 있습니다.',
  },
  {
    title: '다. 비밀을 보호받을 권리',
    description:
      '환자는 진료와 관련된 신체상·건강상의 비밀과 사생활의 비밀을 침해받지 않습니다. 의료인과 의료기관은 환자의 동의를 받거나 범죄 수사 등 법률에서 정한 경우를 제외하고 비밀을 누설하거나 발표하지 못합니다.',
  },
  {
    title: '라. 상담·조정을 신청할 권리',
    description:
      '환자는 병원 이용 중 불만이나 불편 사항을 표현할 수 있습니다. 의료서비스와 관련한 분쟁이 발생한 경우 한국소비자원 또는 한국의료분쟁조정중재원 등에 상담 및 조정을 신청할 수 있습니다.',
  },
  {
    title: '마. 신체적 안전을 보호받을 권리',
    description:
      '환자는 병원 내에서 발생할 수 있는 낙상, 감염 및 그 밖의 각종 위험으로부터 신체적 안전을 보호받을 권리가 있습니다.',
  },
  {
    title: '바. 안전한 의료환경에서 의료서비스를 제공받을 권리',
    description:
      '환자는 진료정보가 보호되고 환자안전이 유지되는 의료환경에서 의료서비스를 제공받을 권리가 있습니다.',
  },
];

const patientResponsibilities = [
  {
    title: '가. 의료인에 대한 신뢰·존중 의무',
    description:
      '환자는 자신의 건강 관련 정보를 의료인에게 정확하게 알리고, 의료인의 치료 계획을 신뢰하고 존중하여야 합니다.',
  },
  {
    title: '나. 부정한 방법으로 진료받지 않을 의무',
    description:
      '환자는 진료 전에 본인의 신분을 밝혀야 하며, 다른 사람의 명의로 진료받는 등 거짓이나 부정한 방법으로 진료받지 않아야 합니다.',
  },
  {
    title: '다. 진료과정에 참여할 의무',
    description:
      '환자는 안전한 치료를 위한 의료팀의 구성원으로서 진료 및 치료계획의 수립과 결정 등 환자안전 활동에 적극적으로 참여하여야 합니다.',
  },
  {
    title: '라. 병원의 공공질서와 내규를 준수할 의무',
    description:
      '환자는 다른 환자와 보호자 및 직원의 권익을 보호하기 위하여 병원의 공공질서와 내규를 준수하여야 합니다.',
  },
];

function PolicyItems({
  items,
}: {
  items: Array<{ title: string; description: string }>;
}) {
  return (
    <ol className="space-y-7">
      {items.map((item) => (
        <li key={item.title}>
          <h3 className="mb-2 text-[16px] font-bold leading-[1.55] text-gray-900 md:text-[17px]">
            {item.title}
          </h3>
          <p>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

export default function PatientRightsPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 break-keep text-center text-[28px] font-bold leading-[1.3] text-gray-900 sm:mb-12 sm:text-3xl">
          환자의 권리와 의무
        </h1>

        <div className="space-y-10 break-keep text-[15px] leading-[1.75] text-gray-700 [overflow-wrap:anywhere] [&_h2]:break-keep [&_h2]:leading-[1.45] sm:space-y-12 md:text-base md:leading-relaxed">
          <section>
            <p className="font-medium text-gray-900">
              연세척병원은 환자의 존엄과 가치를 존중하며, 안전하고 신뢰할 수 있는 의료서비스를 제공하기 위해 환자의 권리와 의무를 다음과 같이 안내합니다.
            </p>
          </section>

          <section aria-labelledby="patient-rights-heading">
            <h2 id="patient-rights-heading" className="mb-4 text-xl font-bold text-[#e6005c]">
              환자의 권리
            </h2>
            <PolicyItems items={patientRights} />
          </section>

          <section aria-labelledby="patient-responsibilities-heading">
            <h2
              id="patient-responsibilities-heading"
              className="mb-4 text-xl font-bold text-[#e6005c]"
            >
              환자의 의무
            </h2>
            <PolicyItems items={patientResponsibilities} />
          </section>

          <section className="border-t border-gray-200 pt-6 text-sm text-gray-500">
            <p>
              본 안내는 의료법 제4조 및 의료법 시행규칙 제1조의3에 따른 환자의 권리와 의무를 바탕으로 연세척병원의 환자안전 원칙을 함께 반영하였습니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
