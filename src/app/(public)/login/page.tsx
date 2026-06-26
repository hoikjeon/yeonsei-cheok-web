'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Phone,
  MapPin,
  Search
} from 'lucide-react';
import { signInWithSocial, signInWithEmail, signUp, requestPasswordReset } from './actions';
import { TERMS_AND_CONDITIONS, PRIVACY_POLICY } from './terms';

type AuthMode = 'signin' | 'signup' | 'reset';

// Kakao/Daum Postcode window type
declare global {
  interface Window {
    daum: any;
  }
}

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // URL 에러 파라미터 확인 및 안내
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      let errorMsg = error;
      if (error === 'no_code_found') {
        errorMsg = '인증 코드를 찾을 수 없습니다. 다시 시도해 주세요.';
      } else if (error === 'auth_failed') {
        errorMsg = '인증에 실패했습니다. 메일 링크가 만료되었는지 확인해 주세요.';
      }
      setMessage({ type: 'error', text: decodeURIComponent(errorMsg) });
    }
  }, []);

  // Signup State
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') extraAddress += data.bname;
          if (data.buildingName !== '') extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        setPostcode(data.zonecode);
        setAddress(fullAddress);
      }
    }).open();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    
    // Add address info to formData manually as they are handled by state
    formData.append('address', `${postcode} ${address} ${formData.get('addressDetail')}`);

    try {
      if (mode === 'signup') {
        if (!agreedTerms || !agreedPrivacy) {
          setMessage({ type: 'error', text: '모든 필수 약관에 동의해 주세요.' });
          setIsLoading(false);
          return;
        }
        const result = await signUp(formData);
        if (result?.error) {
          setMessage({ type: 'error', text: result.error });
        } else if (result?.success) {
          setMessage({ type: 'success', text: '회원가입이 완료되었습니다! 가입하신 이메일로 로그인해 주세요.' });
          setMode('signin'); // 가입 성공 시 로그인 모드로 자동 전환
        }
      } else if (mode === 'reset') {
        const result = await requestPasswordReset(formData);
        if (result?.error) {
          setMessage({ type: 'error', text: result.error });
        } else if (result?.success) {
          setMessage({ type: 'success', text: '비밀번호 재설정 메일이 발송되었습니다! 메일함을 확인해 주세요.' });
          setTimeout(() => setMode('signin'), 3000); // 3초 후 로그인 화면으로 자동 전환
        }
      } else {
        const result = await signInWithEmail(formData);
        if (result?.error) {
          setMessage({ type: 'error', text: result.error });
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: '알 수 없는 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-x-hidden md:py-20">
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-navy-950/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full z-10 transition-all duration-500 ${mode === 'signup' ? 'max-w-[720px]' : 'max-w-[480px]'}`}
      >
        <div className="mb-8 flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink font-bold transition-all hover:-translate-x-1">
            <ChevronLeft size={18} /> 홈페이지로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden">
          {/* Header Section */}
          <div className="p-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl text-primary mb-6">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-[28px] md:text-[32px] font-black text-ink tracking-tighter leading-tight mb-2">
              {mode === 'signin' && '반갑습니다!'}
              {mode === 'signup' && '환영합니다!'}
              {mode === 'reset' && '비밀번호 재설정'}
            </h1>
            <p className="text-ink-muted font-medium text-[15px]">
              {mode === 'signin' && '건강한 척추 관절의 시작, 연세척병원입니다.'}
              {mode === 'signup' && '간편한 가입으로 프리미엄 진료 서비스를 경험하세요.'}
              {mode === 'reset' && '가입하신 이메일로 재설정 링크를 보내드립니다.'}
            </p>
          </div>

          {/* Tab Switcher */}
          {mode !== 'reset' && (
            <div className="px-10 mb-8">
              <div className="flex p-1.5 bg-slate-100 rounded-2xl relative">
                <motion.div 
                  className="absolute top-1.5 bottom-1.5 left-1.5 bg-white rounded-[14px] shadow-sm z-0"
                  initial={false}
                  animate={{ 
                    x: mode === 'signin' ? 0 : '100%',
                    width: 'calc(50% - 3px)'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <button 
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-3 text-[14px] font-bold z-10 transition-colors ${mode === 'signin' ? 'text-ink' : 'text-ink-muted'}`}
                >
                  로그인
                </button>
                <button 
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-3 text-[14px] font-bold z-10 transition-colors ${mode === 'signup' ? 'text-ink' : 'text-ink-muted'}`}
                >
                  회원가입
                </button>
              </div>
            </div>
          )}

          <div className="px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {mode === 'signup' ? (
                    /* SIGNUP FORM */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* ... existing signup fields ... */}
                      <div className="space-y-4 md:col-span-2">
                        <h3 className="text-[17px] font-bold text-ink flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" /> 기본 정보 입력
                        </h3>
                      </div>

                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="text" 
                          name="fullName"
                          placeholder="성함"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                        />
                      </div>

                      <div className="flex gap-4 items-center">
                        <label className="flex-1 cursor-pointer group">
                          <input type="radio" name="gender" value="남" className="peer hidden" required />
                          <div className="py-4 text-center border-2 border-transparent bg-slate-50 peer-checked:bg-primary/5 peer-checked:border-primary/20 peer-checked:text-primary text-ink-muted font-bold rounded-2xl transition-all">남성</div>
                        </label>
                        <label className="flex-1 cursor-pointer group">
                          <input type="radio" name="gender" value="여" className="peer hidden" required />
                          <div className="py-4 text-center border-2 border-transparent bg-slate-50 peer-checked:bg-pink-50 peer-checked:border-pink-200 peer-checked:text-pink-500 text-ink-muted font-bold rounded-2xl transition-all">여성</div>
                        </label>
                      </div>

                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="text" 
                          name="birthDate"
                          placeholder="생년월일 (예: 19900101)"
                          maxLength={8}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                        />
                      </div>

                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="tel" 
                          name="phone"
                          placeholder="휴대폰 번호 (010-0000-0000)"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        <div className="flex gap-2">
                          <div className="relative flex-1 group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
                            <input 
                              type="text" 
                              value={postcode}
                              placeholder="우편번호"
                              readOnly
                              required
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-medium text-[15px]"
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={openPostcode}
                            className="px-6 bg-navy-950 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-navy-900 transition-colors"
                          >
                            <Search size={18} /> 주소찾기
                          </button>
                        </div>
                        <input 
                          type="text" 
                          value={address}
                          placeholder="주소"
                          readOnly
                          className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-medium text-[15px]"
                        />
                        <input 
                          type="text" 
                          name="addressDetail"
                          placeholder="상세 주소를 입력하세요"
                          className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-[17px] font-bold text-ink flex items-center gap-2 border-t pt-8 mt-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" /> 계정 정보 설정
                        </h3>
                      </div>

                      <div className="relative group md:col-span-2">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="email" 
                          name="email"
                          placeholder="이메일 주소 (예: yonsei@email.com)"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                        />
                      </div>

                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="password" 
                          name="password"
                          placeholder="비밀번호"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                        />
                      </div>

                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="password" 
                          placeholder="비밀번호 확인"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                        />
                      </div>

                      {/* TERMS SECTION */}
                      <div className="md:col-span-2 space-y-4 pt-10 border-t mt-4 text-left">
                         <h3 className="text-[17px] font-bold text-ink flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-primary rounded-full" /> 약관 동의
                         </h3>
                         
                         {/* Terms Scroll Box 1 */}
                         <div className="space-y-3">
                           <div className="flex items-center justify-between">
                             <span className="text-[14px] font-bold text-ink-sub">회원약관 동의 (필수)</span>
                             <label className="flex items-center gap-2 cursor-pointer group">
                               <input 
                                 type="checkbox" 
                                 checked={agreedTerms} 
                                 onChange={(e) => setAgreedTerms(e.target.checked)}
                                 className="w-5 h-5 accent-primary cursor-pointer"
                               />
                               <span className="text-[14px] font-medium text-ink-muted group-hover:text-primary transition-colors">동의함</span>
                             </label>
                           </div>
                           <div className="h-32 overflow-y-auto p-4 bg-slate-50 rounded-2xl text-[12px] text-ink-muted leading-relaxed border border-slate-100 whitespace-pre-wrap">
                             {TERMS_AND_CONDITIONS}
                           </div>
                         </div>

                         {/* Terms Scroll Box 2 */}
                         <div className="space-y-3 pt-2">
                           <div className="flex items-center justify-between">
                             <span className="text-[14px] font-bold text-ink-sub">개인정보 수집 동의 (필수)</span>
                             <label className="flex items-center gap-2 cursor-pointer group">
                               <input 
                                 type="checkbox" 
                                 checked={agreedPrivacy} 
                                 onChange={(e) => setAgreedPrivacy(e.target.checked)}
                                 className="w-5 h-5 accent-primary cursor-pointer"
                               />
                               <span className="text-[14px] font-medium text-ink-muted group-hover:text-primary transition-colors">동의함</span>
                             </label>
                           </div>
                           <div className="h-32 overflow-y-auto p-4 bg-slate-50 rounded-2xl text-[12px] text-ink-muted leading-relaxed border border-slate-100 whitespace-pre-wrap">
                             {PRIVACY_POLICY}
                           </div>
                         </div>

                         <div className="flex items-center gap-3 py-4 bg-slate-100 rounded-2xl px-5 mt-4">
                           <input type="checkbox" name="smsConsent" id="smsConsent" className="w-5 h-5 accent-primary" />
                           <label htmlFor="smsConsent" className="text-[14px] font-bold text-ink cursor-pointer">
                             SMS/문자 서비스 수신에 동의합니다. (선택)
                           </label>
                         </div>
                      </div>
                    </div>
                  ) : mode === 'reset' ? (
                    /* RESET FORM */
                    <div className="space-y-4">
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="email" 
                          name="email"
                          placeholder="가입하신 이메일 주소를 입력하세요"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                        />
                      </div>
                      <p className="text-[13px] text-ink-muted font-medium px-2">
                        비밀번호 찾기 메일이 발송되지 않는다면 스팸 메일함을 확인해 주세요.
                      </p>
                    </div>
                  ) : (
                    /* SIGNIN FORM */
                    <div className="space-y-4">
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="email" 
                          name="email"
                          placeholder="이메일 주소"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                        />
                      </div>

                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="password" 
                          name="password"
                          placeholder="비밀번호"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-medium text-[15px]"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

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
                    {mode === 'signin' && '로그인하기'}
                    {mode === 'signup' && '연세척병원 가입하기'}
                    {mode === 'reset' && '인증 메일 보내기'}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* OR Divider (Hidden in reset mode) */}
            {mode !== 'reset' && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[13px] font-bold">
                    <span className="bg-white px-4 text-slate-300 font-montserrat uppercase tracking-widest">또는 소셜 계정으로 로그인</span>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => signInWithSocial('kakao')}
                    className="flex items-center justify-center py-4 bg-[#FEE500] hover:bg-[#ebcd00] rounded-2xl transition-all active:scale-95 group relative overflow-hidden"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#191919]"><path d="M12 3c-4.97 0-9 3.134-9 7 0 2.458 1.625 4.636 4.108 5.92-.164.613-.591 2.215-.675 2.535-.104.4.153.395.321.282.131-.088 2.115-1.438 2.964-2.015.748.18 1.536.278 2.282.278 4.97 0 9-3.134 9-7s-4.03-7-9-7z"/></svg>
                    <div className="absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </button>

                  <button 
                    onClick={() => signInWithSocial('google')}
                    className="flex items-center justify-center py-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition-all active:scale-95 group relative overflow-hidden"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    <div className="absolute inset-0 bg-slate-50 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center mt-8 text-[13px] text-ink-muted font-medium pb-10">
          {mode === 'reset' ? (
             <button onClick={() => setMode('signin')} className="text-primary hover:underline font-bold transition-all flex items-center gap-1 mx-auto">
               <ChevronLeft size={16} /> 로그인 화면으로 돌아가기
             </button>
          ) : (
            <>
              계정 찾기가 필요하신가요? <button onClick={() => setMode('reset')} className="text-primary hover:underline font-bold">비밀번호 재설정</button>
            </>
          )}
          <br />
          <span className="opacity-50 mt-4 block leading-relaxed">
             연세척병원 고객센터: 1588-0000 <br />
             &copy; {new Date().getFullYear()} Yonsei Cheok Hospital. All rights reserved.
          </span>
        </p>
      </motion.div>
    </main>
  );
}
