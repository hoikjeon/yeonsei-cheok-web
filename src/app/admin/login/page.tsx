'use client';

import { useState } from 'react';
import { adminLogin } from '../actions';
import { Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Convert to FormData
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await adminLogin(formData);
      if (response?.error) {
        setError(response.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative">
      <Link href="/" className="absolute top-8 left-8 text-slate-500 font-bold hover:text-primary transition-colors text-sm flex items-center gap-2">
        &larr; 홈페이지로 돌아가기
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-premium p-10 mt-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">관리자 로그인</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">연세척병원 통합 관리 시스템</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input 
                type="text" 
                name="id"
                autoComplete="off"
                placeholder="관리자 아이디를 입력하세요" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold text-navy-950 placeholder:text-slate-400"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                name="password"
                placeholder="비밀번호를 입력하세요" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold text-navy-950 placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-sm font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 text-white font-black text-[15px] rounded-xl transition-all shadow-md ${isLoading ? 'bg-slate-400' : 'bg-navy-950 hover:bg-primary active:scale-[0.98]'}`}
          >
            {isLoading ? '인증 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
