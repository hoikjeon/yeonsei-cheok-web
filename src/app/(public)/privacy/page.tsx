import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 연세척병원',
  description: '연세척병원의 개인정보처리방침입니다.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">개인정보처리방침</h1>
        
        <div className="space-y-12 text-gray-700 leading-relaxed text-sm md:text-base">
          <section>
            <p className="mb-4 font-medium text-gray-900">
              연세척병원(이하 "본원"이라 한다)은 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제1조(개인정보의 처리목적)</h2>
            <p className="mb-4">
              ① 본원은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음 각 호의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ol className="list-decimal pl-5 mb-6 space-y-1">
              <li>홈페이지 회원가입 및 관리</li>
              <li>진단 및 치료를 위한 진료서비스 제공</li>
              <li>진료/검사/건진 예약, 예약조회, 건진 종합소견 조회, 웹 문진</li>
              <li>진료비 청구, 수납, 환급 등 원무서비스 제공</li>
              <li>건강증진센터 소식, 검진결과 및 기타 고지사항 전달</li>
              <li>병원이용 안내 및 병원의 새로운 서비스, 행사정보 안내</li>
              <li>교육, 연구에 필요한 최소한의 분석자료</li>
              <li>의료의 질 관리, 의료기관 인증평가, 병원운영을 위한 법적·행정적 대응 및 조치</li>
              <li>민원/고충 처리 등을 위한 의사소통의 경로 확보</li>
            </ol>
            
            <p className="mb-4">
              ② 본원이 개인정보보호법 제32조에 따라 등록ㆍ공개하는 개인정보파일의 처리목적은 다음과 같습니다.
            </p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-gray-200 text-sm">
                <thead className="bg-gray-50 border-t-2 border-gray-700">
                  <tr>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">순번</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">개인정보파일의 명칭</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">운영근거/처리목적</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">개인정보파일에 기록되는 개인정보의 항목</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">보유기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center">1</td>
                    <td className="border border-gray-200 p-3 text-center">홈페이지 회원정보</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">정보주체 동의에 의한 홈페이지 회원가입/병원 내 정보서비스 제공</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">이름, 집주소, 집연락처, 휴대폰번호, 성별, 유입경로, 아이디, 비밀번호</td>
                    <td className="border border-gray-200 p-3 text-center">회원 탈퇴시 까지</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center">2</td>
                    <td className="border border-gray-200 p-3 text-center">환자정보파일</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">의료법 제22조의료법 시행규칙 제14조/환자정보관리(외래,입원,응급)</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">이름, 집주소, 직장주소, 집연락처, 직장연락처, 휴대폰번호, 주민번호</td>
                    <td className="border border-gray-200 p-3 text-center">10년</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center">3</td>
                    <td className="border border-gray-200 p-3 text-center">법정 감염병 신고</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">감염병의 예방 및 관리에 관한 법률/기관 내 감염병의 발생과 분포를 신속, 정확하게 파악 및 관리</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">이름, 집주소, 휴대폰번호, 환자등록번호, 주민번호, 성별</td>
                    <td className="border border-gray-200 p-3 text-center">준영구</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center">4</td>
                    <td className="border border-gray-200 p-3 text-center">단체검진 대상자 명단</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">의료법 제21조(기록열람 등), 산업안전보건법 제43조(건강진단)/종합건강검진 전반적인 업무 수행을 위함</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">이름, 집주소, 직장주소, E-Mail, 집연락처, 휴대폰번호, 주민번호, 기타 검진결과</td>
                    <td className="border border-gray-200 p-3 text-center">10년</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center">5</td>
                    <td className="border border-gray-200 p-3 text-center">EDI청구서 헤더파일</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">국민건강보험법 시행규칙 제14조/EDI 심사청구</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">이름, 주민번호</td>
                    <td className="border border-gray-200 p-3 text-center">영구</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center">6</td>
                    <td className="border border-gray-200 p-3 text-center">미수 내역 파일(EDI 수신서식)</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">개인정보보호법 제15조 제1항 6호/미수 환자 및 미수 내역 관리</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">이름, 주민번호</td>
                    <td className="border border-gray-200 p-3 text-center">영구</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500">
              ※ 좀 더 상세한 행정안전부의 개인정보파일 등록사항 공개는 행정안전부 개인정보보호 종합지원 포털(www.privacy.go.kr) → 개인정보민원 → 개인정보열람 등 요구 → 개인정보파일 목록검색 메뉴를 활용해주시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제2조(개인정보의 처리 및 보유기간)</h2>
            <p className="mb-4">
              ① 본원은 법령에 따른 개인정보 보유ㆍ이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유ㆍ이용기간 내에서 개인정보를 처리ㆍ보유합니다.
            </p>
            <p className="mb-4">
              ② 각각의 개인정보 처리 및 보유 기간은 다음 각 호와 같습니다.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>홈페이지 회원가입 및 관리</strong> : 본원 홈페이지 탈퇴 시까지 보유, 동의 받은 경우에 한하여 2년마다 갱신</li>
              <li><strong>진료서비스 제공을 위하여 수집한 정보</strong> : 『의료법』시행규칙 제 15조 "진료에 관한 기록의 보존"에 명시된 기간에 준하여 보존, 수집 목적이 달성된 후에도 보존할 필요성이 있는 경우에는 보유기간을 연장할 수 있습니다. (기록물평가심의회 등에서 매년 심의 후 결정)</li>
              <li><strong>설문조사를 위한 수집</strong> : 설문조사 종료시 까지</li>
              <li><strong>민원사무처리를 위한 정보</strong> : 민원처리 종료 후 10년</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제3조(개인정보의 제3자 제공)</h2>
            <p className="mb-4">
              ① 본원은 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서 처리하며, 다음의 경우를 제외하고는 정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-6">
              <li>정보주체로부터 별도의 동의를 받는 경우</li>
              <li>법률에 특별한 규정이 있는 경우</li>
              <li>정보주체 또는 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로 사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</li>
              <li>통계작성 및 학술연구 등의 목적을 위하여 필요한 경우로서 특정 개인을 알아 볼 수 없는 형태로 개인정보를 제공하는 경우</li>
              <li>개인정보를 목적 외의 용도로 이용하거나 이를 제3자에게 제공하지 아니하면 다른 법률에서 정하는 소관 업무를 수행할 수 없는 경우로서 보호위원회의 심의·의결을 거친 경우</li>
              <li>조약, 그 밖의 국제협정의 이행을 위하여 외국정보 또는 국제기구에 제공하기 위하여 필요한 경우</li>
              <li>범죄의 수사와 공소의 제기 및 유지를 위하여 필요한 경우</li>
              <li>법원의 재판업무 수행을 위하여 필요한 경우</li>
              <li>형 및 감호, 보호처분의 집행을 위하여 필요한 경우</li>
            </ul>

            <p className="mb-4">
              ② 제공받는 기관은 다음과 같습니다.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm">
                <thead className="bg-gray-50 border-t-2 border-gray-700">
                  <tr>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">개인정보파일</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">제공기관</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">개인정보 제공 항목</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">제공 목적</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">제공기간</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">제공근거</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center">건강보험 EDI 송신/심사청구</td>
                    <td className="border border-gray-200 p-3 text-center">국민건강보험공단</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">이름, 주민번호, 전화번호, 주소</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">요양급여비용을 청구목적</td>
                    <td className="border border-gray-200 p-3 text-center">지속적제공</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">국민건강보험법 시행규칙 제19조(요양급여비용의 청구)</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center">원외처방전</td>
                    <td className="border border-gray-200 p-3 text-center">외부약국</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">이름, 주민번호, 진단 및 처방자료</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">의사나 치과의사가 직접 의약품을 조제할 수 있는 경우가 아니면 처방전을 작성하여 환자에게 내주거나 발송</td>
                    <td className="border border-gray-200 p-3 text-center">지속적제공</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">의료법 제18조(처방전 작성과 교부)</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center">수사협조</td>
                    <td className="border border-gray-200 p-3 text-center">경찰서, 법원</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">소견서 및 의무기록 사본</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">직무 수행에 필요하다고 인정되는 상당한 이유가 있을 때에는 국가기관이나 공사단체 등에 직무 수행에 관련된 사실을 조회가능. 다만, 긴급한 경우에는 경찰관으로 하여금 현장에 나가 해당 기관장의 협조를 받아 그 사실을 확인</td>
                    <td className="border border-gray-200 p-3 text-center">지속적제공</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">형사소송법 제106조(압수) 형사소송법 제215조(압수,수색,검증) 경찰관직무집행법 제8조 제1항(사실의 확인 등)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제4조(개인정보처리의 위탁)</h2>
            <p className="mb-4">
              ① 본원은 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-gray-200 text-sm">
                <thead className="bg-gray-50 border-t-2 border-gray-700">
                  <tr>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">위탁사</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">위탁업무 내용</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">위탁하는 개인정보항목</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">보유 및 이용기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center">마케팅위너</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">홈페이지 내 데이터베이스</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">이름,등록번호, 비밀번호, 전화번호 아이디 등</td>
                    <td className="border border-gray-200 p-3 text-center">위탁계약 종료 시 까지</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mb-2">
              ② 본원은 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적ㆍ관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리ㆍ감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지 를 감독하고 있습니다.
            </p>
            <p className="mb-4">
              ③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체 없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제5조 (정보주체의 권리ㆍ의무 및 행사방법)</h2>
            <p className="mb-2">
              ① 정보주체는 본원에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ol className="list-decimal pl-5 space-y-1 mb-4">
              <li>개인정보 열람요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제요구</li>
              <li>처리정지 요구</li>
            </ol>
            <p className="mb-2">
              ② 제1항에 따른 권리 행사는 본원에 대해 개인정보 보호법 시행규칙 별지 제8호 서식(개인정보 열람, 정정·삭제, 처리정지 요구서)에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 본원은 이에 대해 지체 없이 조치하겠습니다.
            </p>
            <p className="mb-2">
              ③ 정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 본원은 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.
            </p>
            <p className="mb-4">
              ④ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식(위임장)에 따른 위임장을 제출하셔야 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제6조 (처리하는 개인정보 항목)</h2>
            <p className="mb-4">본원은 다음의 개인정보 항목을 처리하고 있습니다.</p>
            <ul className="space-y-4">
              <li>
                <strong className="block mb-1">① 홈페이지 회원 가입 및 관리</strong>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>필수항목 : 아이디, 비밀번호, 성명, 주소, 휴대폰번호</li>
                  <li>선택항목 : 성별, 전화번호, 가입경로</li>
                </ul>
              </li>
              <li>
                <strong className="block mb-1">② 환자 진료 접수 및 관리</strong>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>필수항목/수집항목 : 성명, 전화번호, 주소, 주민등록번호, 이메일 등</li>
                </ul>
              </li>
              <li>
                <strong className="block mb-1">③ 홈페이지 진료예약시스템</strong>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>수집항목 : 환자성명, 주소, 연락처, 휴대폰번호, 이메일, 증상</li>
                </ul>
              </li>
              <li>
                <strong className="block mb-1">④ 고객의 소리</strong>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>수집항목 : 성명, 성별, 연락처, 이메일</li>
                </ul>
              </li>
              <li>
                <strong className="block mb-1">⑤ 친절직원추천</strong>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>수집항목 : 고객명, 연락처, 휴대폰번호, 이메일, 주소, 환자성명, 환자등록번호</li>
                </ul>
              </li>
              <li>
                <strong className="block mb-1">⑥ 실시간 상담</strong>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>수집항목 : 성명, 나이, 휴대폰번호, 거주지</li>
                </ul>
              </li>
              <li>
                <strong className="block mb-1">⑦ 인터넷 서비스 이용과정에서 아래 개인정보 항목이 자동으로 생성되어 수집될 수 있습니다.</strong>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록 등</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제7조 (개인정보의 파기)</h2>
            <p className="mb-2">
              ① 본원은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보 파기합니다.
            </p>
            <p className="mb-2">
              ② 정보주체로부터 동의 받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보(또는 개인정보파일)을 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
            </p>
            <p className="mb-2">
              ③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li><strong>파기절차</strong> : 본원은 파기하여야 하는 개인정보(또는 개인정보파일)에 대해 개인정보 파기계획을 수립하여 파기합니다. 본원은 파기 사유가 발생한 개인정보(또는 개인정보파일)를 선정하고, 본원의 개인정보 보호책임자의 승인을 받아 개인정보(또는 개인정보파일)를 파기합니다.</li>
              <li><strong>파기방법</strong> : 본원은 전자적 파일 형태로 기록ㆍ저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록ㆍ저장된 개인정보는 분쇄한 후 용해하여 파기합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제8조 (개인정보의 안전성 확보조치)</h2>
            <p className="mb-4">
              ① 본원은 고객의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>
            <div className="space-y-4 pl-5">
              <div>
                <strong className="block mb-2">1. 기술적 조치</strong>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>개인정보의 안전한 저장 및 전송 등을 위하여 법령이 정한 기준을 준수하고 있습니다.</li>
                  <li>고객의 개인정보는 외부망에서 접근 및 침입이 불가능한 내부망을 활용하여 관리되고 있으며, 파일 및 전송데이터를 암호화하거나 파일 잠금 기능 을 사용하여 중요한 데이터는 별도의 보안기능을 통해 철저하게 보호되고 있습니다.</li>
                  <li>본원은 암호알고리즘 등의 이용을 통하여 네트워크상에서 개인정보를 안전하게 전송할 수 있는 보안 장치를 채택하고 있습니다.</li>
                </ul>
              </div>
              <div>
                <strong className="block mb-2">2. 관리적 조치</strong>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>본원은 고객의 개인정보에 대한 접근 및 관리에 필요한 절차 등을 마련하여 소속 직원으로 하여금 이를 숙지하고 준수하도록 하고 있습니다.</li>
                  <li>본원은 고객의 개인정보를 취급할 수 있는 자를 최소한으로 제한하고 있습니다. 고객의 개인정보를 취급할 수 있는 자는 아래와 같습니다.
                    <ul className="list-[circle] pl-5 mt-1 mb-1">
                      <li>고객을 직ㆍ간접적으로 상대로 하여 인터넷 업무를 수행하는 자</li>
                      <li>개인정보관리책임자 및 개인정보보호담당자 등 개인정보관리ㆍ보호업무를 수행하는 자</li>
                      <li>기타 업무상 개인정보의 취급이 불가피한 자</li>
                    </ul>
                  </li>
                  <li>본원은 컴퓨터를 이용하여 고객의 개인정보를 처리하는 경우 개인정보에 대한 접근권한을 가진 담당자를 지정하여 식별부호(ID) 및 비밀번호를 부여하고, 해당 비밀번호를 정기적으로 갱신하고 있습니다.</li>
                  <li>개인정보를 취급하는 직원을 대상으로 새로운 보안기술 습득 및 개인정보보호 의무 등에 관해 정기적인 사내교육 및 외부 위탁교육을 실시하고 있습니다.</li>
                  <li>신규직원 채용 시 정보보호서약서에 서명함으로 직원에 의한 정보유출을 사전에 방지하고 개인정보처리방침에 대한 이행사항 및 직원의 준수여부를 감사하기 위한 내부절차를 마련 하여 지속적으로 시행하고 있습니다.</li>
                  <li>직원 퇴직 시 정보보호서약서에 서명함으로 고객의 개인정보를 취급하였던 자가 직무상 알게 된 개인정보를 훼손ㆍ침해 또는 누설하지 않도록 하고 있습니다.</li>
                  <li>개인정보 취급자의 업무 인수인계는 보안이 유지된 상태에서 철저하게 이뤄지고 있으며, 입사 및 퇴사 후 개인정보 침해사고에 대한 책임을 명확하게 규정하고 있습니다.</li>
                  <li>서비스이용계약체결 또는 서비스제공을 위하여 고객의 신용카드번호 등 대금결제에 관한 정보를 수집하거나 고객에게 제공하는 경우 당해 고객이 본인임을 확인하기 위하여 필요한 조치를 취하고 있습니다.</li>
                </ul>
              </div>
              <div>
                <strong className="block mb-2">3. 물리적 조치</strong>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>개인정보와 개인정보처리시스템의 안전한 보관을 위하여 물리적 잠금장치 등의 물리적 접근방지를 위한 보호조치를 취하고 있습니다.</li>
                  <li>정보전산팀 및 보건의료정보팀의 자료보관실 등을 특별 통제구역으로 설정하여 출입 통제 등 출입관리 절차를 시행하고 있습니다.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제9조(개인정보 보호책임자)</h2>
            <p className="mb-4">
              ① 본원은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">1. 개인정보 보호책임자</h3>
                <ul className="text-gray-600 space-y-1">
                  <li><strong>직책 :</strong> 총무팀</li>
                  <li><strong>연락처 :</strong> 010-8558-2126</li>
                  <li><strong>이메일 :</strong> izzimrock@naver.com</li>
                  <li><strong>팩스번호 :</strong> 070-4009-1494</li>
                </ul>
                <p className="text-sm text-gray-500 mt-2">※ 개인정보 보호 담당부서로 연결됩니다.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">2. 개인정보 보호 담당부서</h3>
                <ul className="text-gray-600 space-y-1">
                  <li><strong>부서명 :</strong> 총무팀</li>
                  <li><strong>연락처 :</strong> 010-8558-2126</li>
                  <li><strong>이메일 :</strong> izzimrock@naver.com</li>
                  <li><strong>팩스번호 :</strong> 070-4009-1494</li>
                </ul>
              </div>
            </div>
            <p className="mb-4">
              ② 정보주체는 본원의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 본원은 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제10조(개인정보 열람청구)</h2>
            <p className="mb-4">
              ① 정보주체는 개인정보 보호법 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 본원은 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
              <h3 className="font-bold text-gray-900 mb-2">개인정보 열람청구 접수ㆍ처리부서</h3>
              <ul className="text-gray-600 space-y-1">
                <li><strong>부서명 :</strong> 총무팀</li>
                <li><strong>담당자 :</strong> 도형록 주임</li>
                <li><strong>연락처 :</strong> 010-8558-2126</li>
                <li><strong>이메일 :</strong> izzimrock@naver.com</li>
                <li><strong>팩스번호 :</strong> 070-4009-1494</li>
              </ul>
            </div>
            <p className="mb-4">
              ② 정보주체는 제1항의 열람청구 접수ㆍ처리부서 이외에, 행정안전부의 '개인정보보호 종합지원 포털' 웹사이트(www.privacy.go.kr)를 통하여서도 개인정보 열람청구를 하실 수 있습니다.
              <br/>
              <span className="text-gray-500 text-sm">ㆍ행정안전부 개인정보보호 종합지원 포털 → 개인정보 민원 → 개인정보 열람 등 요구 (본인 확인을 위하여 I-PIN이 있어야 함)</span>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제11조 (권익침해 구제방법)</h2>
            <p className="mb-4">
              ① 정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다. (아래의 기관은 본원과는 별개의 기관으로서, 본원의 자체적인 개인정보 불만처리, 피해구제 결과에 만족하지 못하시거나 보다 자세한 도움이 필요하시면 문의하여 주시기 바랍니다)
            </p>
            <ul className="space-y-4 text-gray-600">
              <li>
                <strong className="block text-gray-900">1. 개인정보 침해신고센터 (한국인터넷진흥원 운영)</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>소관업무 : 개인정보 침해사실 신고, 상담 신청</li>
                  <li>홈페이지 : privacy.kisa.or.kr</li>
                  <li>전화 : (국번 없이) 118</li>
                  <li>주소 : (138-950) 서울시 송파구 중대로 135 한국인터넷진흥원 개인정보침해신고센터</li>
                </ul>
              </li>
              <li>
                <strong className="block text-gray-900">2. 개인정보 분쟁조정위원회 (한국인터넷진흥원 운영)</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>소관업무 : 개인정보 분쟁조정신청, 집단분쟁조정 (민사적 해결)</li>
                  <li>홈페이지 : privacy.kisa.or.kr</li>
                  <li>전화 : (국번 없이) 118</li>
                  <li>주소 : (138-950) 서울시 송파구 중대로 135 한국인터넷진흥원 개인정보침해신고센터</li>
                </ul>
              </li>
              <li><strong>3. 대검찰청 사이버범죄수사단</strong> : 02-3480-3573 (www.spo.go.kr)</li>
              <li><strong>4. 경찰청 사이버테러대응센터</strong> : 1566-0112 (www.police.go.kr)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제12조(영상정보처리기기의 설치ㆍ운영)</h2>
            <p className="mb-4">
              본원의 영상정보처리기기의 설치ㆍ운영 방침은 별도의 페이지에서 게시하고 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제13조(영업 양도·합병 등에 따른 개인정보의 이전)</h2>
            <p className="mb-4">
              본원은 영업의 전부 또는 일부의 양도·합병 등으로 개인정보를 다른 사람에게 이전하는 경우에 미리 다음 각 호의 사항을 개인정보처리방침에 기재하여 공개하겠습니다.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-600">
              <li>개인정보를 이전하려는 사실</li>
              <li>개인정보를 이전받는 자(이하 "영업양수자등"이라 한다)의 성명(법인의 경우에는 법인의 명칭을 말한다), 주소, 전화번호 및 그 밖의 연락처</li>
              <li>정보주체가 개인정보의 이전을 원하지 아니하는 경우 조치할 수 있는 방법 및 절차</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">제14조(개인정보 처리방침 변경)</h2>
            <p className="mb-4">
              ① 이 개인정보처리방침은 시행일로부터 적용됩니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 inline-block text-gray-700">
              <span className="mr-6"><strong>시행일자 :</strong> 2018. 10</span>
              <span className="mr-6"><strong>담당부서 :</strong> 총무팀</span>
              <span><strong>연락처 :</strong> 010-8558-2126</span>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
