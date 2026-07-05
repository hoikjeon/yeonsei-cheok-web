import React from 'react';
import { Metadata } from 'next';
import { nonCoveredData } from './data';

export const metadata: Metadata = {
  title: '비급여안내 | 연세척병원',
  description: '연세척병원의 비급여 항목 진료비를 안내합니다.',
};

export default function NonCoveredPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">비급여안내</h1>
        
        <div className="mb-12 text-center text-gray-700">
          <p className="mb-2 font-semibold">비급여 항목 진료비를 안내합니다.</p>
          <p className="text-sm text-red-500 mt-4">
            의료법 제 45조 제1항 및 제2항과 동법 시행규칙 제42조의 2제1항, 제2항 및 제3항에 의하여 비급여 진료비용을 고지하기 위해 안내합니다.
          </p>
        </div>

        <div 
          className="relative w-full overflow-hidden bg-blue-900 mb-16 flex flex-col justify-center px-6 py-10 sm:py-16 sm:px-12 rounded-lg"
          style={{
            backgroundImage: "url('/images/coins_banner.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay"
          }}
        >
          <div className="relative z-10 text-white max-w-4xl mx-auto w-full">
            <h2 className="text-lg sm:text-2xl font-bold mb-6 break-keep">의료법 제45조(비급여 항목안내 등의 고지)에 관하여 아래와 같이 비급여 항목안내를 게시합니다.</h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-100">
              <li>- 행위의 경우 직접 시술에 대한 비용으로 입원료, 마취료, 약제, 치료재료 등은 별도 산정.</li>
              <li>- 비급여 진료비용은 단일 개별 항목외 1회 비용이므로 처방량에 따라 해당 항목의 비용이 달라질 수 있습니다.</li>
              <li>- 기준일 : 2025년 4월 3일</li>
            </ul>
          </div>
          <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply pointer-events-none"></div>
        </div>

        <div className="space-y-12">
          {nonCoveredData.map((section, sectionIdx) => {
            const isSubHeading = /^\d+-\d+장\./.test(section.title);
            return (
            <section key={sectionIdx}>
              {isSubHeading ? (
                <h3 className="text-lg sm:text-xl font-medium text-center text-gray-700 mb-4">{section.title}</h3>
              ) : (
                <h2 className="text-2xl font-bold text-gray-700 mb-6">{section.title}</h2>
              )}
              
              {section.groups.length > 0 && (
              <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-gray-50 border-b-2 border-gray-700 text-gray-800 text-center text-xs sm:text-sm">
                    <tr>
                      <th rowSpan={2} className="p-3 border-r border-gray-200 align-middle">분류</th>
                      <th colSpan={2} className="p-3 border-r border-b border-gray-200">항목</th>
                      <th colSpan={6} className="p-3 border-r border-b border-gray-200">가격정보(단위:원)</th>
                      <th rowSpan={2} className="p-3 border-r border-gray-200 align-middle">특이사항</th>
                      <th rowSpan={2} className="p-3 align-middle">최종변경일</th>
                    </tr>
                    <tr>
                      <th className="p-2 border-r border-gray-200 font-medium">명칭</th>
                      <th className="p-2 border-r border-gray-200 font-medium">코드</th>
                      <th className="p-2 border-r border-gray-200 font-medium">구분</th>
                      <th className="p-2 border-r border-gray-200 font-medium">비용</th>
                      <th className="p-2 border-r border-gray-200 font-medium">최저비용</th>
                      <th className="p-2 border-r border-gray-200 font-medium">최고비용</th>
                      <th className="p-2 border-r border-gray-200 font-medium">치료재료대<br/>포함여부</th>
                      <th className="p-2 border-r border-gray-200 font-medium">약제비<br/>포함여부</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {section.groups.map((group, groupIdx) => (
                      group.items.map((item, itemIdx) => (
                        <tr key={`${groupIdx}-${itemIdx}`} className="hover:bg-gray-50 transition-colors">
                          {itemIdx === 0 && (
                            <td 
                              rowSpan={group.items.length} 
                              className="p-3 border-r border-b border-gray-200 text-center align-middle font-medium text-gray-700 bg-white"
                            >
                              {group.categoryName}
                            </td>
                          )}
                          <td className="p-3 border-r border-gray-200 text-gray-800">{item.name}</td>
                          <td className="p-3 border-r border-gray-200 text-center text-gray-600">{item.code}</td>
                          <td className="p-3 border-r border-gray-200 text-center text-gray-600">{item.division}</td>
                          <td className="p-3 border-r border-gray-200 text-right font-medium text-gray-900">{item.cost}</td>
                          <td className="p-3 border-r border-gray-200 text-right text-gray-600">{item.minCost}</td>
                          <td className="p-3 border-r border-gray-200 text-right text-gray-600">{item.maxCost}</td>
                          <td className="p-3 border-r border-gray-200 text-center text-gray-600">{item.materialIncluded}</td>
                          <td className="p-3 border-r border-gray-200 text-center text-gray-600">{item.drugIncluded}</td>
                          <td className="p-3 border-r border-gray-200 text-gray-600 max-w-[200px] truncate" title={item.note}>{item.note}</td>
                          <td className="p-3 text-center text-gray-500 text-xs">{item.updateDate}</td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </section>
          )})}
        </div>
      </div>
    </main>
  );
}
