import Link from 'next/link';

interface SubHeroProps {
  title: string;
  subtitle: string;
  path: { name: string; href?: string }[];
  bgImage?: string;
}

const SubHero = ({ title, subtitle, path, bgImage }: SubHeroProps) => {
  return (
    <section className="relative h-[400px] flex items-center overflow-hidden bg-[#172b4d]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#172b4d]/40 to-[#172b4d] z-10" />
        {bgImage ? (
          <img 
            src={bgImage} 
            alt={title} 
            className="w-full h-full object-cover opacity-30 scale-105"
          />
        ) : (
          <div className="w-full h-full bg-primary/20" />
        )}
      </div>
      
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-10">
        <div className="space-y-6 fade-in-up">
          <nav className="flex items-center gap-3 text-[11px] font-bold tracking-widest font-montserrat uppercase text-primary-light/60">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {path.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[8px] opacity-30">/</span>
                {p.href ? (
                  <Link href={p.href} className="hover:text-white transition-colors">{p.name}</Link>
                ) : (
                  <span className="text-white/40">{p.name}</span>
                )}
              </div>
            ))}
          </nav>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-xl text-slate-300 font-medium max-w-2xl">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default SubHero;
