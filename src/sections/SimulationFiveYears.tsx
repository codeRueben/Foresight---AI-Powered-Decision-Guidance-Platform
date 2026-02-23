import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, TrendingUp, Fingerprint, Crown, Target, Sparkles } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

gsap.registerPlugin(ScrollTrigger);

interface VisionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

function VisionCard({ title, description, icon, highlight = false }: VisionCardProps) {
  return (
    <div className={`glass-card p-5 lg:p-6 hover:scale-[1.03] transition-all cursor-pointer gpu-accelerate ${
      highlight ? 'border-foresight-accent/40 shadow-[0_0_30px_rgba(79,109,255,0.15)]' : ''
    }`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          highlight ? 'bg-foresight-accent/30 shadow-[0_0_20px_rgba(79,109,255,0.3)]' : 'bg-foresight-accent/20'
        }`}>
          <div className="text-foresight-accent">{icon}</div>
        </div>
        <div>
          <h3 className="font-display text-xl text-foresight-text mb-2">{title}</h3>
          <p className="text-sm text-foresight-text-muted/80 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function SimulationFiveYears() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  const { simulationResult: _simulationResult } = useSimulation();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cards = cardsRef.current;

    if (!section || !headline || !cards) return;

    const cardElements = cards.querySelectorAll('.vision-card');

    const ctx = gsap.context(() => {
      // Simple fade-in animations
      gsap.fromTo(
        headline,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        cardElements,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="5years"
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-16"
    >
      {/* Headline */}
      <h2
        ref={headlineRef}
        className="absolute top-[10%] left-1/2 -translate-x-1/2 font-display text-[clamp(48px,8vw,100px)] font-light text-foresight-text drop-shadow-[0_0_40px_rgba(79,109,255,0.3)]"
      >
        5 Years
      </h2>

      {/* Cards grid */}
      <div
        ref={cardsRef}
        className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[95vw] lg:max-w-[1200px] px-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="vision-card gpu-accelerate">
            <VisionCard
              title="Future self"
              description="You're calmer, more decisive, and protective of your time."
              icon={<User className="w-6 h-6" />}
            />
          </div>
          <div className="vision-card gpu-accelerate">
            <VisionCard
              title="Financial range"
              description="Revenue swings early; later it stabilizes. The trade-off: autonomy."
              icon={<TrendingUp className="w-6 h-6" />}
              highlight
            />
          </div>
          <div className="vision-card gpu-accelerate">
            <VisionCard
              title="Identity"
              description="You no longer describe yourself by a job title. You describe the work."
              icon={<Fingerprint className="w-6 h-6" />}
            />
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center hover:scale-105 transition-transform">
            <Crown className="w-5 h-5 text-foresight-accent mx-auto mb-2" />
            <p className="text-lg font-display text-foresight-text">Expert</p>
            <p className="text-xs text-foresight-text-muted">Status</p>
          </div>
          <div className="glass-card p-4 text-center hover:scale-105 transition-transform">
            <Target className="w-5 h-5 text-foresight-accent mx-auto mb-2" />
            <p className="text-lg font-display text-foresight-text">Clear</p>
            <p className="text-xs text-foresight-text-muted">Vision</p>
          </div>
          <div className="glass-card p-4 text-center hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-foresight-accent mx-auto mb-2" />
            <p className="text-lg font-display text-foresight-text">Fulfilled</p>
            <p className="text-xs text-foresight-text-muted">State</p>
          </div>
        </div>
      </div>
    </section>
  );
}
