'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AnalyticsProps {
  visits: any[];
}

export function AnalyticsSummary({ visits }: AnalyticsProps) {
  const todayRaw = new Date();
  const todayString = todayRaw.toLocaleDateString();
  const yesterdayRaw = new Date(todayRaw.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayString = yesterdayRaw.toLocaleDateString();

  let todayTotal = 0;
  let yesterdayTotal = 0;

  visits.forEach(v => {
    const vDate = new Date(v.visited_at);
    if (vDate.toLocaleDateString() === todayString) {
      todayTotal += 1;
    } else if (vDate.toLocaleDateString() === yesterdayString) {
      yesterdayTotal += 1;
    }
  });

  const diff = todayTotal - yesterdayTotal;
  const diffPercent = yesterdayTotal > 0 ? Math.round((diff / yesterdayTotal) * 100) : 0;
  const diffText = diff >= 0 ? `+${diffPercent}%` : `${diffPercent}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-lg">
         <p className="text-blue-100 font-bold mb-1">오늘 총 방문자</p>
         <h3 className="text-4xl font-bold">{todayTotal} <span className="text-lg font-bold text-blue-200">명</span></h3>
      </div>
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-center">
         <p className="text-ink-muted font-bold mb-1 text-sm">어제 대비 증감</p>
         <h3 className="text-2xl font-bold text-ink">
           {yesterdayTotal > 0 ? diffText : '첫 데이터'}
         </h3>
      </div>
    </div>
  );
}

export function AnalyticsGraphs({ visits }: AnalyticsProps) {
  const todayRaw = new Date();
  const todayString = todayRaw.toLocaleDateString();
  
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}시`,
    visits: 0
  }));

  const dailyDataMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayRaw.getTime() - i * 24 * 60 * 60 * 1000);
    const mmdd = `${d.getMonth() + 1}/${d.getDate()}`;
    dailyDataMap[mmdd] = 0;
  }

  visits.forEach(v => {
    const vDate = new Date(v.visited_at);
    if (vDate.toLocaleDateString() === todayString) {
      hourlyData[vDate.getHours()].visits += 1;
    }
    const mmdd = `${vDate.getMonth() + 1}/${vDate.getDate()}`;
    if (dailyDataMap[mmdd] !== undefined) {
      dailyDataMap[mmdd] += 1;
    }
  });

  const dailyData = Object.keys(dailyDataMap).map(key => ({
    date: key,
    visits: dailyDataMap[key]
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-10">
      <section className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-slate-200">
         <h3 className="text-[17px] font-bold text-ink mb-6">오늘 시간대별 접속량 추이</h3>
         <div className="h-[300px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
               <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
               <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
               />
               <Area type="monotone" dataKey="visits" name="방문자 수" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
             </AreaChart>
           </ResponsiveContainer>
         </div>
      </section>

      <section className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-slate-200">
         <h3 className="text-[17px] font-bold text-ink mb-6">최근 7일 방문 트렌드</h3>
         <div className="h-[300px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
               <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
               <Tooltip 
                 cursor={{ fill: '#f8fafc' }}
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
               />
               <Bar dataKey="visits" name="방문자 수" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} />
             </BarChart>
           </ResponsiveContainer>
         </div>
      </section>
    </div>
  );
}
