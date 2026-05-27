'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { updateNewPassword } from '../actions';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: '비밀번호가 일치하지 않습니다.' });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: '비밀번호는 최소 6자 이상이어야 합니다.' });
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateNewPassword(formData);
      if (result?.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result?.success) {
        setMessage({ type: 'success', text: '비밀번호가 성공적으로 변경되었습니다! 잠시 후 메인 페이지로 이동합니다.' });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: '비밀번호 변경 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-navy-950/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden">
          <div className="p-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl text-primary mb-6">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-[28px] md:text-[32px] font-black text-navy-950 tracking-tighter leading-tight mb-2">
              새 비밀번호 설정
            </h1>
            <p className="text-slate-400 font-medium text-[15px]">
              안전하게 계정을 복구하기 위해 <br /> 새로운 비밀번호를 입력해 주세요.
            </p>
          </div>

          <div className="px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    name="password"
                    placeholder="새로운 비밀번호"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                  />
                </div>
              </div>

              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                  <p className="text-[13px] font-medium leading-relaxed">{message.text}</p>
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-navy-950 hover:bg-navy-900 text-white rounded-2xl font-bold text-[17px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-navy-950/20 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    비밀번호 변경하기
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-8 text-[13px] text-slate-400 font-medium pb-10">
          문제가 지속되시나요? <Link href="/" className="text-primary hover:underline font-bold">고객센터 문의하기</Link> <br />
          <span className="opacity-50 mt-4 block leading-relaxed">
             &copy; {new Date().getFullYear()} Yonsei Cheok Hospital. All rights reserved.
          </span>
        </p>
      </motion.div>
    </main>
  );
}
