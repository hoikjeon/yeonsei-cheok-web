'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Activity, Award, CheckCircle, Shield, ArrowUpRight } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } 
    },
  };

  return (
    <div className="flex flex-col space-y-0">
      {/* 🎬 Hero Section: The Cinematic Entrance */}
      <section className="relative h-[95vh] min-h-[800px] flex items-center overflow-hidden bg-navy-950">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/40 to-navy-950 z-10" />
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src="/hero-bg.png" 
            alt="Yonsei Cheok Hospital Premium Facility" 
            className="w-full h-full object-cover opacity-60 grayscale-[20%]"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-20">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl space-y-12"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-premium border border-white/10 shadow-blue-glow">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-white/80 text-[11px] font-bold tracking-[0.2em] uppercase">
                  Yonsei University Severance Expertise
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tight">
                세브란스에서 온 <br />
                <span className="text-gradient">탁월한 실력</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-2xl font-normal">
                연세대 세브란스 교수 출신의 정밀한 진단과 <br className="hidden md:block" />
                환자 중심의 정직한 진료로 당신의 일상을 회복합니다.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
              <Link 
                href="/reservation" 
                className="group relative px-10 py-5 bg-primary text-white font-bold rounded-full overflow-hidden shadow-premium hover:shadow-blue-glow transition-all active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  진료 예약하기 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary-dark translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
              <Link 
                href="/about" 
                className="px-10 py-5 glass-premium text-white font-bold rounded-full border border-white/10 hover:bg-white/5 transition-all text-[15px]"
              >
                의료진 소개
              </Link>
            </motion.div>
            
            {/* Quick Stats Overlay */}
            <motion.div variants={itemVariants} className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5">
              {[
                { label: '임상 경력', value: '15Y+' },
                { label: '연간 환자수', value: '15,000+' },
                { label: '수술 및 시술', value: '3,000+' },
                { label: '환자 만족도', value: '99%' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-3xl font-black text-white tracking-tighter leading-none">{stat.value}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em]">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Abstract Geometry: For Editorial Feel */}
        <div className="absolute right-[-10%] top-[40%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
      </section>

      {/* 🧭 Medical Expertise Section: Editorial Grid */}
      <section id="expertise" className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
            <div className="lg:col-span-5 space-y-6">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary font-black tracking-[0.3em] uppercase text-xs"
              >
                Specialized Care
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-black text-navy-950 tracking-tight leading-[1.1]"
              >
                정확한 원칙 <br />
                정교한 치료
              </motion.h2>
            </div>
            <div className="lg:col-span-7 pt-4">
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                불필요한 과잉 진료는 지양하며, 첨단 MRI와 CT 등 대학병원급 장비를 통해 
                가장 정직하고 효과적인 치료 솔루션을 제시합니다.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: '척추 클리닉', 
                desc: '허리디스크, 척추관 협착증 등 만성 통증부터 고난도 척추 수술까지 세브란스의 기술력으로 치료합니다.', 
                icon: <Activity className="w-8 h-8" />,
                tags: ['디스크', '신경성형술', '내시경치료']
              },
              { 
                title: '관절 클리닉', 
                desc: '무릎, 어깨, 고관절 질환에 대해 정밀한 관절 내시경 및 맞춤형 강화 치료를 제공합니다.', 
                icon: <Award className="w-8 h-8" />,
                tags: ['줄기세포', '오십견', '인공관절']
              },
              { 
                title: '재활·통증 클리닉', 
                desc: '도수치료 전문가의 일대일 맞춤 치료와 체외충격파 등 비수술적 통증 완화 솔루션을 운영합니다.', 
                icon: <CheckCircle className="w-8 h-8" />,
                tags: ['도수치료', '충격파', '체형교정']
              },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="group relative p-12 bg-slate-50/50 rounded-[3rem] border border-transparent hover:border-primary/10 hover:bg-white transition-all hover:shadow-premium"
              >
                <div className="space-y-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-navy-950 tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed font-medium text-[15px]">{item.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white text-slate-400 text-[11px] font-bold rounded-lg border border-slate-100 uppercase tracking-tighter">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/treatments`} className="pt-6 flex items-center gap-2 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                    자세히 보기 <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🛡️ Trust & Performance Section */}
      <section className="py-40 bg-navy-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-12 mb-32">
            <div className="flex items-center gap-3 px-4 py-1 bg-white/5 rounded-full border border-white/5">
              <Shield className="text-primary w-4 h-4" />
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Our Commitment to Excellence</span>
            </div>
            <h2 className="max-w-4xl text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
              최상의 결과를 위한 <br />
              <span className="text-gradient">연세척의 3대 원칙</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                label: 'Precision Diagnosis', 
                title: '오진 없는 정교함', 
                desc: '세브란스 출신 3인 원장이 모든 케이스를 직접 검토하여 오진의 가능성을 차단합니다.' 
              },
              { 
                label: 'Advanced Technology', 
                title: '대학병원급 첨단 장비', 
                desc: '최고 사양의 MRI 및 CT 장비를 도입하여 보이지 않는 통증의 원인까지 찾아냅니다.' 
              },
              { 
                label: 'Safety First', 
                title: '수술실 안심 모니터링', 
                desc: '모든 수술 과정을 투명하게 관리하며 철저한 감염 예방 시스템을 운영합니다.' 
              },
            ].map((principle, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-6 text-center md:text-left"
              >
                <div className="text-[10px] font-black text-primary tracking-[0.3em] uppercase">{principle.label}</div>
                <h3 className="text-3xl font-bold text-white tracking-tight">{principle.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-[15px]">{principle.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Background Element */}
        <div className="absolute left-[-20%] bottom-[-10%] w-[600px] h-[600px] border border-primary/10 rounded-full animate-[spin_60s_linear_infinite]" />
      </section>

      {/* 🚀 Final CTA Section */}
      <section id="reservation-cta" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-20 bg-primary rounded-[4rem] text-center space-y-10 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-6">
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">
                통증 없는 내일, <br />
                함께 시작하세요.
              </h2>
              <p className="text-white/80 text-xl font-medium">
                더 늦기 전에 연세척병원 전문가와 상담하세요. 정확한 진단이 회복의 시작입니다.
              </p>
              <div className="pt-6">
                <Link 
                  href="/reservation" 
                  className="inline-flex items-center gap-3 px-12 py-6 bg-white text-primary font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl"
                >
                  지금 바로 예약하기 <ChevronRight size={20} />
                </Link>
              </div>
            </div>
            {/* Background Texture Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)]" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
