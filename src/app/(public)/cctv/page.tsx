import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '영상정보처리기기 운영방침 | 연세척병원',
  description: '연세척병원의 영상정보처리기기 운영방침입니다.',
};

export default function CctvPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">영상정보처리기기 운영방침</h1>
        
        <div className="space-y-12 text-gray-700 leading-relaxed text-sm md:text-base">
          
          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">1. 목적</h2>
            <p className="mb-4">
              본 연세척병원(이하 본 원이라 함)은 영상정보처리기기 설치·운영 방침을 통해 본 원에서 처리하는 개인영상정보를 보호하고 법률에 적합게 이용·관리하기 위함.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">2. 영상정보처리기기의 설치 근거</h2>
            <p className="mb-2">가. 개인정보보호법 제25조 제1항에 따라 다음과 같은 목적으로 영상정보처리기기를 설치·운영 함.</p>
            <ul className="list-none pl-5 mb-4 space-y-1 text-gray-600">
              <li>(1) 법령에 구체적으로 허용하고 있는 경우</li>
              <li>(2) 고객의 안전을 위한 범죄의 예방 및 수사를 위하여 필요한 경우</li>
              <li>(3) 시설안전 및 화재 예방을 위하여 필요한 경우</li>
              <li>(4) 교통단속을 위하여 필요한 경우</li>
            </ul>
            <p className="mb-4">나. 영상정보처리기기의 설치는 개인정보보호위원회에서 심의 의결하여 정한다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">3. 영상정보처리기기 운영현황 및 처리방법</h2>
            <p className="mb-2">가. 운영현황(설치대수, 설치위치, 촬영범위)</p>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-200 text-sm">
                <thead className="bg-gray-50 border-t-2 border-gray-700">
                  <tr>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">설치목적</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">설치운영대수</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">설치위치 및 주요찰영범위</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">촬영시간</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">영상정보보관기간</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">영상정보보관장소</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center text-gray-600">시설안전, 화재예방, 정보보안</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">6대</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">대기실, 침구실, 산소치료실, 적외선치료실, 복도</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">24시간 연속촬영 및 녹화</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600"></td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mb-2">나. 처리방법</p>
            <ul className="list-none pl-5 space-y-1 text-gray-600">
              <li>(1) 개인영상정보의 목적외 이용, 제3자 제공, 열람 등 요구, 파기에 관한 사항을 기록·관리</li>
              <li>(2) 보관기간 만료 시 복원이 불가능한 방법으로 영구 삭제 (출력물의 경우 파쇄 또는 소각)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">4. 관리책임자 및 접근권한자</h2>
            <p className="mb-4">영상정보를 보호하고 개인영상정보와 관련한 불만을 처리하기 위하여 아래와 같이 개인영상정보 보호 및 관리책임자를 지정 함.</p>
            
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-gray-200 text-sm">
                <thead className="bg-gray-50 border-t-2 border-gray-700">
                  <tr>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">구분</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">이름</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">직위</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">소속</th>
                    <th className="border border-gray-200 p-3 font-semibold text-gray-800 text-center whitespace-nowrap">연락처</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center text-gray-600">관리책임자</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600"></td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">실장</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">연세척병원</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600"></td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="border border-gray-200 p-3 text-center text-gray-600">접근권한자</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600"></td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">실장</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600">연세척병원</td>
                    <td className="border border-gray-200 p-3 text-center text-gray-600"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">5. 개인영상정보의 확인방법 및 장소에 관한 사항</h2>
            <p className="mb-2">가. 개인영상정보에 관하여 열람 또는 존재확인·삭제를 원하는 경우 언제든지 영상정보처리기기 담당부서에 요구 할 수 있음. (단, 본인이 촬영된 개인 영상 정보 및 영상정보에 한정)</p>
            <p className="mb-4">나. 열람 등을 요구할 경우에는 개인영상정보 「열람·존재확인 청구서」를 작성하여 담당부서에 제출하여야 한다. [별지 서식1호]</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">6. 정보주체의 영상정보 열람 등 요구에 대한 조치</h2>
            <p className="mb-2">가. 담당부서에서는 개인영상정보에 관하여 열람 또는 존재확인·삭제를 요구받은 경우 지체 없이 필요한 조치를 한다.</p>
            <p className="mb-2">나. 다음의 경우에는 정보주체의 개인영상정보 열람 등 요구를 거부할 수 있다. 이 경우 관리책임부서는 10일 이내에 서면 등으로 거부 사유를 정보주체에게 통지 함.</p>
            <ul className="list-none pl-5 mb-4 space-y-1 text-gray-600">
              <li>(1) 범죄수사·공소유지·재판수행에 중대한 지장을 초래하는 경우</li>
              <li>(2) 개인영상정보의 보관기간이 경과하여 파기한 경우</li>
              <li>(3) 본열람 등 요구에 대하여 필요한 조치를 취함으로써 타인의 사생활권이 침해 될 우려가 큰 경우</li>
              <li>(4) 기타 정보주체의 열람 등 요구를 거부할 만한 정당한 사유가 존재하는 경우</li>
            </ul>
            <p className="mb-2">다. 개인정보를 수집 목적 이외로 이용하거나 제3자에게 제공하는 경우에는 다음 각 호의 사항을「개인영상정보 관리대장, 작성요령」에 기록하고 이를 관리한다. [별지 서식2호, 2-1호]</p>
            <ul className="list-none pl-5 mb-4 space-y-1 text-gray-600">
              <li>(1) 개인영상정보 파일의 명칭</li>
              <li>(2) 이용하거나 제공 받은 자의 명칭</li>
              <li>(3) 이용 또는 제공의 목적</li>
              <li>(4) 법령상 이용 또는 제공 근거가 있는 경우 그 근거</li>
              <li>(5) 이용 또는 제공의 기간이 정해져 있는 경우에는 그 근거</li>
              <li>(6) 이용 또는 제공의 형태</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">7. 영상정보의 안전성 확보조치</h2>
            <p className="mb-2">가. 영상정보는 암호화 조치 등을 통하여 안전하게 관리한다.</p>
            <p className="mb-2">나. 개인영상정보보호를 위한 관리적 대책으로서 개인정보에 대한 접근 권한을 차등부여하고, 개인영상정보의 위·변조 방지를 위하여 개인영상 정보의 생성일시, 열람 시 열람 목적·열람자·열람 일시 등을 기록하여 관리한다.</p>
            <p className="mb-4">다. 이 외에도 개인영상정보의 안전한 물리적 보관을 위하여 잠금장치 등을 설치하여 물리적 보안을 확보한다.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#e6005c] mb-4">8. 개인정보 처리방침 변경에 관한 사항</h2>
            <p className="mb-4">
              이 영상정보처리기기 설치·운용 방침은 2014.10에 제정되었으며 법령∙정책 또는 보안기술의 변경에 따라 내용의 추가·삭제 및 수정이 있을 시에는 시행하기 최소 7일전에 본 기관 홈페이지를 통해 변경사유 및 내용 등을 공지토록 함.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 inline-block text-gray-700">
              <p><strong>• 담당부서 :</strong> 진료지원팀</p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
