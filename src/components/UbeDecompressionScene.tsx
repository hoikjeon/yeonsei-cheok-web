import Image from 'next/image';

const UbeDecompressionScene = () => {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-b from-[#F8FAFC] to-white md:h-[540px]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary-light/70 to-transparent" />

      <div className="absolute inset-x-[-7%] bottom-[2%] z-10 h-[62%] md:inset-x-[-2%] md:bottom-[2%] md:h-[64%]">
        <Image
          src="/generated/ube/ube-intro-spine.png"
          alt="양방향 척추내시경 감압술 설명을 위한 척추 3D 이미지"
          fill
          priority
          sizes="(min-width: 1024px) 1050px, 94vw"
          className="object-contain drop-shadow-[0_18px_36px_rgba(15,29,54,0.18)]"
        />
      </div>

      <div className="ube-endoscope absolute left-[12%] top-[5%] z-30 h-[56%] w-[34%] md:left-[17%] md:top-[5%] md:h-[58%] md:w-[32%]">
        <Image
          src="/generated/ube/ube-intro-endoscope.png"
          alt="척추 내시경 카메라 기구"
          fill
          priority
          sizes="(min-width: 1024px) 520px, 48vw"
          className="object-contain drop-shadow-[0_18px_30px_rgba(15,29,54,0.22)]"
        />
      </div>

      <div className="ube-working-tool absolute right-[12%] top-[4%] z-30 h-[58%] w-[34%] md:right-[17%] md:top-[4%] md:h-[60%] md:w-[32%]">
        <Image
          src="/generated/ube/ube-intro-instrument.png"
          alt="척추내시경 감압술 수술기구"
          fill
          priority
          sizes="(min-width: 1024px) 520px, 48vw"
          className="object-contain drop-shadow-[0_18px_30px_rgba(15,29,54,0.22)]"
        />
      </div>

      <style>{`
        .ube-endoscope {
          animation: ubeEndoscopeMotion 4.4s ease-in-out infinite;
          transform-origin: 78% 83%;
        }

        .ube-working-tool {
          animation: ubeWorkingToolMotion 4.8s ease-in-out infinite;
          transform-origin: 22% 84%;
        }

        @keyframes ubeEndoscopeMotion {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-1deg);
          }
          50% {
            transform: translate3d(4px, 3px, 0) rotate(0.6deg);
          }
        }

        @keyframes ubeWorkingToolMotion {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(1deg);
          }
          50% {
            transform: translate3d(-4px, 3px, 0) rotate(-0.6deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ube-endoscope,
          .ube-working-tool {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default UbeDecompressionScene;
